"use client"

import Image from "next/image";
import styles from "./post.module.css";

interface Post {
    text: string;
    title?: string;
    handle: string;
    displayName: string;
    profilePic: string;
    image: string;
    budget: number;
    minimumFollowers?: number;
    rewardPerShare?: number;
    mirrored?: boolean;
}

export default function Post({manageable, data, activatePromotion, index, onMirror} : {manageable: boolean, data: Post, activatePromotion?: (index: number) => void, onMirror?: (index: number) => void, index?: number}) {
    return (
        <div className={styles.postContainer}>
            {!manageable &&
                <div className={styles.topBar}>
                    <div className={styles.statsContainer}>
                        <Image style={{borderRadius: "50%"}} width={50} height={50} src={data.profilePic} alt={"image"} />  
                        <div>
                            <b>{data.displayName}</b>
                            <div>@{data.handle}</div>
                        </div> 
                        <div style={{marginLeft: 30}}>
                            Mirror reward: <b>{data.rewardPerShare} MATIC</b>
                        </div>
                        <button className={`${!data.mirrored ? styles.mirrorBtn : styles.disabledBtn}`} onClick={() => {if (onMirror) {onMirror(index as number)}}}>{!data.mirrored ? "Mirror" : "You have mirrored this post!"}</button>
                    </div>
                </div>
            }
            <div className={styles.innerContainer}>
                {data.image &&
                    <Image style={{borderRadius: 5}} width={200} height={200} src={data.image} alt={"image"} />
                }
                <div>
                    {data.title && <b>{data.title}</b>}
                    <div>{data.text}</div>
                </div>
            </div>
            {manageable &&
                <div className={styles.bottomBar}>
                    {data.minimumFollowers && data.rewardPerShare &&
                        <div className={styles.statsContainer}>
                            <div><b>Minimum followers:</b> {data.minimumFollowers}</div>
                            <div><b>Reward per share:</b> {data.rewardPerShare}</div>
                        </div>
                    }
                    <div className={styles.bottomBarBottom}>
                        {data.budget ?
                            <div>
                                <b>Budget:</b> {data.budget}
                            </div>
                        :
                            <button className={styles.activateBtn} onClick={() => {if (activatePromotion) {activatePromotion(index as number)}}}>
                                Activate promotion
                            </button>   
                        }
                    </div>
                </div>
            }
        </div>
    );
}