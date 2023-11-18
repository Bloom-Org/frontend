'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup} from "@/components/ui/select"
import styles from "./manage-camapigns.module.css";
import { useEffect, useState } from "react"
import { textOnly } from '@lens-protocol/metadata';
import { uploadIpfs } from "@/ipfs"
import { CreateOnchainPostTypedDataDocument, OnchainPostRequest, PublicationsDocument, PublicationsRequest } from "@/graphql/generated"
import { apolloClient } from "@/apolloClient/client"
import { gql } from "@apollo/client";
import { signTypedData } from "@wagmi/core";
import { omit, splitSignature } from "@/ethers.service";
import { broadcastOnchainRequest } from "@/broadcast/shared-broadcast";
import { waitUntilBroadcastTransactionIsComplete } from "@/transaction/wait-until-complete";
import { LENS_HUB_ABI, LENS_HUB_CONTRACT, OPEN_ACTION_CONTRACT } from "@/config/config"
import { ethers } from "ethers"
import { useAccount, usePrepareSendTransaction, useSendTransaction } from "wagmi"
import { lensHub } from "@/lens-hub"
import { useWalletClient } from "wagmi"
import { lensHubAbi } from "@/lensHubAbi"
import { getLoggedInProfileId } from "@/lib/auth"
import Post from "@/components/post"
import { sendTransaction } from '@wagmi/core'
import Modal from "@/components/ui/modal/modal"
import { parseEther, zeroAddress } from 'viem'

const mockPostsInitial = [
    {title: "Mock post 1", minimumFollowers: 20, rewardPerShare: 2, image: "https://images.unsplash.com/photo-1601370552761-d129028bd833?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D", text: "This is a cool mock post.", budget: 0}
];

export default function ManageCampaigns() {
    const [postType, setPostType] = useState<string>("");
    const [postTime, setPostTime] = useState<string>("");
    const [message, setMessage] = useState("");
    const [text, setText] = useState<string>("");
    const [budget, setBudget] = useState<string>("");
    const [rewardPerShare, setRewardPerShare] = useState<string>("");
    const [minFollowers, setMinFollowers] = useState<string>("");
    const [promotedPosts, setPromotedPosts] = useState<any[]>(mockPostsInitial);
    const [loading, setLoading] = useState<boolean>(false);
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [activatingPromotion, setActivatingPromotion] = useState<number>(-1);
    const profileId = getLoggedInProfileId();

    const clearInputs = () => {
        setText("");
        setBudget("");
        setMessage("");
        setRewardPerShare("");
        setMinFollowers("");
        setPostType("");
        setPostTime("");
    }

    const post = async () => {
        if (!loading) {
            if (postType) {
                if (rewardPerShare && minFollowers && postTime) {
                    if (postType === "text") {
                        if (text) {
                            setPromotedPosts([...promotedPosts, {title: "Mock post " + JSON.stringify(promotedPosts.length + 1), image: "", text: text, budget: 0, rewardPerShare: rewardPerShare, minimumFollowers: minFollowers}]);
                            clearInputs();
                        } else {
                            setMessage("Please write some text for your post.");        
                        }
                    } else if (postType === "image") {
                        setPromotedPosts([...promotedPosts, {title: "Mock post " + JSON.stringify(promotedPosts.length + 1), image: "", text: "This is a mock post.", budget: 0,  rewardPerShare: rewardPerShare, minimumFollowers: minFollowers}]);
                        clearInputs();
                    }
                } else {
                    setMessage("Please complete all fields.");
                }
            } else {
                setMessage("Please select a post type.");
            }
        }
    };

    const activatePromotion = async () => {
        let posts = [...promotedPosts];
        posts[activatingPromotion].budget = parseInt(budget);
         
        const { hash } = await sendTransaction({
            to: zeroAddress,
            value: parseEther('0.01'),
        })

        setPromotedPosts(posts);
        setActivatingPromotion(-1);
        console.log("test");
    };

    return (
        <div className={styles.container}>
            <Modal visible={activatingPromotion !== -1} style={{paddingInline: 40}} closable onClose={() => setActivatingPromotion(-1)} width={600} height={300}>
                <h1 className={styles.activateTitle}>Activate Promotion</h1>
                <div className="flex flex-col space-y-3" style={{marginTop: 30}}>
                    <Label htmlFor="name">Budget</Label>
                    <Input value={budget} placeholder="e.g. 100" onChange={(e) => setBudget(e.target.value)} />
                </div>
                <Button variant="outline" style={{marginTop: 20}} onClick={() => activatePromotion()}>Activate Promotion</Button>
            </Modal>
            <Card className={`w-[68%] min-w-[350px] my-4 h-[100%] ${styles.postsContainer}`} > 
                <CardHeader>
                    <CardTitle>My promoted posts</CardTitle>
                    <CardDescription>View and manage your promoted posts.</CardDescription>
                </CardHeader>
                <CardContent style={{gap: 20, display: "flex", flexDirection: "column"}}>
                    {promotedPosts.map((post, index) => {
                        return <Post data={post} key={"post" + index} index={index} manageable activatePromotion={(i) => {setActivatingPromotion(i)}}/>
                    })}
                </CardContent>
            </Card>
            <div className="w-[28%] min-w-[350px] h-[100%]" style={{height: "fit-content"}}>
                <Card className="w-[100%] my-4 h-[100%]" style={{overflow: "scroll"}}>
                    <CardHeader>
                        <CardTitle>Create a promoted post</CardTitle>
                        <CardDescription>Create a post to be promoted on the lens protocol.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <Select value={postType} onValueChange={(newValue) => setPostType(newValue)}>
                                    <SelectTrigger className="w-[100%]">
                                        <SelectValue placeholder="Select a post type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="image">Image</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {postType === "text" ?
                                    <div className="flex flex-col space-y-1.5">
                                        <Textarea value={text} placeholder="What's happening?" onChange={(e) => setText(e.target.value)} style={{maxHeight: 200}} />
                                    </div>
                                : postType === "image" &&
                                    <div></div>
                                }
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Reward-per-share</Label>
                                    <Input value={rewardPerShare} placeholder="Amount" onChange={(e) => setRewardPerShare(e.target.value)} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Minimum Followers</Label>
                                    <Input value={minFollowers} placeholder="e.g. 100" onChange={(e) => setMinFollowers(e.target.value)} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Minimum mirror time</Label>
                                    <Select value={postTime} onValueChange={(newValue) => setPostTime(newValue)}>
                                        <SelectTrigger className="w-[100%]">
                                            <SelectValue placeholder="Select a time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="12-h">12 hours</SelectItem>
                                                <SelectItem value="1-d">1 day</SelectItem>
                                                <SelectItem value="3-d">3 days</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => post()}>{!loading ? "Post" : "Creating post..."}</Button>
                    </CardFooter>
                    {message && <div style={{color: "red", marginInline: "25px", marginBottom: 20}}>{message}</div>}
                </Card>
            </div>
        </div>    
    );
}
