'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ModeToggle } from '@/components/dropdown'
import { Droplets } from "lucide-react"
import { useContext, useEffect, useState } from 'react'
import { useAccount, useDisconnect } from "wagmi";
import { signMessage } from "@wagmi/core";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import styles from './nav.module.css'
import { Button } from '@/components/ui/button'
import { apolloClient } from '@/apolloClient/client'
import { gql } from "@apollo/client";
import { AuthenticateDocument, ChallengeDocument, ChallengeRequest, ProfilesDocument, ProfilesRequest, SignedAuthChallenge } from '@/graphql/generated'
import Modal from './ui/modal/modal'
import { ProfileFromHandle } from '@/components/ui/profile/page'
import { getLoggedInAddress, getLoggedInHandle, logout, saveLoginData } from '@/lib/auth'
import { AppContext } from '@/context/AppContext'
import { pushRoute } from '@/lib/pushRoute'
import Image from 'next/image'
import FullLogo from '@/public/images/full_logo.png';

export function Nav() {
    const pathname = usePathname();
    const router = useRouter();
    const appState = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const { openConnectModal } = useConnectModal();
    const { disconnect } = useDisconnect();
    const { address, isConnected, isConnecting } = useAccount();
    const [profilesToChooseFrom, setProfilesToChooseFrom] = useState([] as any[]);
    const isLoggedIn = getLoggedInAddress();
    const loggedInHandle = getLoggedInHandle();

    const getProfilesRequest = async (request: ProfilesRequest) => {
        const result = await apolloClient.query({
        query: gql(ProfilesDocument),
            variables: {
                request,
            },
        });
        return result.data.profiles;
    };


    const generateChallenge = async (request: ChallengeRequest) => {
        const result = await apolloClient.query({
          query: gql(ChallengeDocument),
          variables: {
            request,
          },
        });
        return result.data.challenge;
    };
    
    const authenticate = async (request: SignedAuthChallenge) => {
        const result = await apolloClient.mutate({
          mutation: gql(AuthenticateDocument),
          variables: {
            request,
          },
        });
        
        return result.data!.authenticate;
    };

    const completeLogin = async (id : string, handle: string) => {
        const challengeResponse = await generateChallenge({ for: id, signedBy : address });
        // sign the text with the wallet
        const signature = await signMessage({message: challengeResponse.text});
    
        const authenticatedResult = await authenticate({ id: challengeResponse.id, signature } as SignedAuthChallenge);

        saveLoginData(authenticatedResult.accessToken, authenticatedResult.refreshToken, address as string, handle, id);
        setProfilesToChooseFrom([]);
        pushRoute({router: router, route: "/manage-campaigns", appState: appState});
    };

    const login = async () => {
        if (!loading) {
            setLoading(true);
            const profiles = await getProfilesRequest({where: {ownedBy: [address]}});
            if (profiles.items.length > 0) {
                if (profiles.items.length === 1) {
                    completeLogin(profiles.items[0].id, profiles.items[0].handle.localName);
                } else {
                    setProfilesToChooseFrom(profiles.items);
                }
            } else {
                disconnect();
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isConnected && !isLoggedIn) {
            login();
        }
    }, [isConnected]);

  return (
      <nav className={`${styles.navBox} bg-white dark:bg-slate-900 dark:border-slate-800`}>
        <Link href="/" className='mr-5 flex items-center'>
          <Image width={100} height={50} style={{marginTop: 3}} src={FullLogo.src} alt="logo" />
        </Link>
        {isLoggedIn &&
            <>
                <div style={{cursor: "pointer", whiteSpace: "nowrap"}} className={`mr-5 text-sm ${pathname !== '/' && 'opacity-50'}`} onClick={() => pushRoute({router: router, route: "/manage-campaigns", appState: appState})}>
                    <p>Manage campaigns</p>
                </div>
                <div style={{cursor: "pointer"}} className={`mr-5 text-sm ${pathname !== '/search' && 'opacity-60'}`} onClick={() => pushRoute({router: router, route: "/explore", appState: appState})}>
                    <p>Explore</p>
                </div>
            </>
        }
        <div className={styles.rightBox}>
            {!isLoggedIn ?
                <>
                    {isConnected && loading &&
                        <div className={styles.walletBtnContainer}>
                            <Button variant={"outline"}>Loading...</Button>
                        </div>
                    }
                    {(!address && !isConnecting) && 
                        <div className={styles.walletBtnContainer}>
                            {openConnectModal && <Button onClick={() => {openConnectModal()}} variant={"outline"}>Login</Button>}
                        </div>
                    }
                    {profilesToChooseFrom && profilesToChooseFrom.length > 0 &&
                        <Modal visible={profilesToChooseFrom.length > 0} closable width={600} height={800} onClose={() => {setProfilesToChooseFrom([]); disconnect()}}>
                            <div className={styles.profilesContainer}>
                                {profilesToChooseFrom.map((profile, i) => {
                                    return (
                                        <div key={i} onClick={() => completeLogin(profile.id, profile.handle.localName)}>
                                            <ProfileFromHandle handle={profile.handle.fullHandle} />
                                        </div>
                                    );
                                })}
                            </div>
                        </Modal>
                    }
                </>
            :
                <>
                    <Button variant={"outline"} >@{loggedInHandle}</Button>
                    <Button variant={"outline"} onClick={() => {logout(); if (address) {disconnect();}}}>Logout</Button>
                </>
            }
            <ModeToggle />
        </div>
      </nav>
  )
}