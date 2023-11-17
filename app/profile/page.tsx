'use client'

import { useAccount } from 'wagmi'
import { useProfiles } from '@lens-protocol/react-web'
import { ProfileDocument, ProfileRequest } from '@/graphql/generated'
import { apolloClient } from '@/apolloClient/client'
import { gql } from "@apollo/client";
import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import Image from 'next/image';
import DefaultProfileImage from '@/public/images/defaultProfileImage.png';   

import {
    Card,
  } from "@/components/ui/card"

export default function ProfileWrapper() {
  const { address } = useAccount()
  if (!address) return null

  return (
    <Profile
      address={address}
    />
  )
}

function Profile({ address }) {
  const { data } = useProfiles({
    where: {
      ownedBy: [address],
    },
  })

  if (!data || !data.length) return null
  const profile = data[data.length - 1]
  if (!profile) return null

  return (
    <main className="px-10 py-14">
      <div>
        <a
          rel='no-opener'
          target='_blank'
        href={`https://share.lens.xyz/u/${profile.handle?.localName}.${profile.handle?.namespace}`}>
          <div className='border rounded-lg p-10'>
            <div>
              {
                profile.metadata?.picture?.__typename === 'ImageSet' && (
                  <img
                    src={profile?.metadata?.picture?.optimized?.uri}
                    className='rounded w-[200px]'
                  />
                )
              }
            </div>
            <div className='mt-4'>
              <p className='text-lg'>
                {profile?.metadata?.displayName}
              </p>
              <p className='text-muted-foreground font-medium'>
                {profile?.handle?.localName}.{profile?.handle?.namespace}
              </p>
            </div>
          </div>
        </a>
     </div>
    </main>
  )
}



export function ProfileFromHandle({ handle }) {
    const [profile, setProfile] = useState<any>(null);
    const getProfileRequest = async (request: ProfileRequest) => {
        const result = await apolloClient.query({
        query: gql(ProfileDocument),
            variables: {
                request,
            },
        });
    
        return result.data.profile;
    };

    useEffect(() => {
        async function fetchProfile() {
            const request = { forHandle: handle };
            const profile = await getProfileRequest(request);
            setProfile(profile);
        }
        fetchProfile();
    }, [handle]);

    if (!profile) return null;

    if (profile.handle.localName === "sdioajahsdio") {
        console.log("YUP");
        console.log(profile);
    }
  
    return (
      <main className="px-8 py-4">
        <div className={styles.container}>
            <Image className={styles.profilePicture} width={60} height={60} src={profile.metadata && profile.metadata.picture ? profile.metadata.picture.optimized.uri : DefaultProfileImage.src} alt="profile-image" />
            <div>
                <span style={{fontWeight: 500}}>@{profile.handle.localName}</span>
                <br />
                {profile.metadata?.displayName}
            </div>
        </div>
      </main>
    )
  }