'use client'

import { disconnect } from '@wagmi/core'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ModeToggle } from '@/components/dropdown'
import { ChevronRight, Droplets, LogOut } from "lucide-react"
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from "wagmi";
import { signMessage } from "@wagmi/core";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import styles from './nav.module.css'
import { Button } from '@/components/ui/button'
import { apolloClient } from '@/apolloClient/client'
import { gql } from "@apollo/client";
import { AuthenticateDocument, ChallengeDocument, ChallengeRequest, ProfilesDocument, ProfilesRequest, SignedAuthChallenge } from '@/graphql/generated'
import Modal from './ui/modal/modal'
import { ProfileFromHandle } from '@/app/profile/page'
import { getLoggedInAddress, getLoggedInHandle, logout, saveLoginData } from '@/lib/auth'

export function Nav() {
    const pathname = usePathname();
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
        console.log(result);
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

        saveLoginData(authenticatedResult.accessToken, authenticatedResult.refreshToken, address as string, handle);
        setProfilesToChooseFrom([]);
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

    console.log(profilesToChooseFrom);

  return (
    <nav>
      <div className={styles.navBox}>
        <Link href="/" className='mr-5 flex items-center'>
          <Droplets className="opacity-85" size={19} />
          <p className={`ml-2 mr-4 text-lg font-semibold`}>lenscn</p>
        </Link>
        <Link href="/" className={`mr-5 text-sm ${pathname !== '/' && 'opacity-50'}`}>
          <p>Home</p>
        </Link>
        <Link href="/search" className={`mr-5 text-sm ${pathname !== '/search' && 'opacity-60'}`}>
          <p>Search</p>
        </Link>
        {
          address && (
            <Link href="/profile" className={`mr-5 text-sm ${pathname !== '/search' && 'opacity-60'}`}>
              <p>Profile</p>
            </Link>
          )
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
      </div>
    </nav>
  )
}