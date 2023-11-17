'use client'

import { ProfileDocument, ProfileRequest } from '@/graphql/generated'
import { apolloClient } from '@/apolloClient/client'
import { gql } from "@apollo/client";
import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import Image from 'next/image';
import DefaultProfileImage from '@/public/images/defaultProfileImage.png';   
import { Card } from "@/components/ui/card"


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
  
    return (
        <main className="px-8 py-4">
            <Card className="border dark:bg-slate-800">
                    <div className={styles.container}>
                        <Image className={styles.profilePicture} width={60} height={60} src={profile.metadata && profile.metadata.picture ? profile.metadata.picture.optimized.uri : DefaultProfileImage.src} alt="profile-image" />
                        <div>
                            <span style={{fontWeight: 500}}>@{profile.handle.localName}</span>
                            <br />
                            {profile.metadata?.displayName}
                        </div>
                    </div>
            </Card>
        </main>
    )
  }