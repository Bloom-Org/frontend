'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup} from "@/components/ui/select"
import styles from "./manage-camapigns.module.css";
import { useState } from "react"
import { textOnly } from '@lens-protocol/metadata';
import { uploadIpfs } from "@/ipfs"
import { CreateOnchainPostTypedDataDocument, OnchainPostRequest } from "@/graphql/generated"
import { apolloClient } from "@/apolloClient/client"
import { gql } from "@apollo/client";
import { signTypedData } from "@wagmi/core";
import { omit } from "@/ethers.service";
import { broadcastOnchainRequest } from "@/broadcast/shared-broadcast";
import { waitUntilBroadcastTransactionIsComplete } from "@/transaction/wait-until-complete";

export default function ManageCampaigns() {
    const [postType, setPostType] = useState<string>("");
    const [postTime, setPostTime] = useState<string>("");
    const [message, setMessage] = useState("");
    const [text, setText] = useState<string>("");
    const [budget, setBudget] = useState<string>("");
    const [rewardPerShare, setRewardPerShare] = useState<string>("");
    const [minFollowers, setMinFollowers] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const createOnchainPostTypedData = async (request: OnchainPostRequest) => {
        const result = await apolloClient.mutate({
          mutation: gql(CreateOnchainPostTypedDataDocument),
          variables: {
            request,
          },
        });
      
        return result.data!.createOnchainPostTypedData;
    };      

    const post = async () => {
        if (!loading) {
            if (postType) {
                if (budget && rewardPerShare && minFollowers && postTime) {
                    if (postType === "text") {
                        if (text) {
                            setLoading(true);
                            const metadata = textOnly({
                                content: text
                            });
                            const ipfsResult = await uploadIpfs(metadata);
                            const request: OnchainPostRequest = {
                                contentURI: `ipfs://${ipfsResult}`
                            };
                            const { id, typedData } = await createOnchainPostTypedData(request);
                            const signature = await signTypedData({domain: omit(typedData.domain, '__typename'), types: omit(typedData.types, '__typename'), message: omit(typedData.value, '__typename'), primaryType: "Post"});
                            const broadcastResult = await broadcastOnchainRequest({ id, signature });
                            await waitUntilBroadcastTransactionIsComplete(broadcastResult, 'post');
                            console.log('post onchain: signature', signature);
                            setLoading(false);
                        } else {
                            setMessage("Please write some text for your post.");        
                        }
                    } else if (postType === "image") {

                    }
                } else {
                    setMessage("Please complete all fields.");
                }
            } else {
                setMessage("Please select a post type.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <Card className={`w-[68%] min-w-[350px] my-4 h-[100%] ${styles.postsContainer}`} > 
                <CardHeader>
                    <CardTitle>My promoted posts</CardTitle>
                    <CardDescription>View and manage your promoted posts.</CardDescription>
                </CardHeader>
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
                                <Select onValueChange={(newValue) => setPostType(newValue)}>
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
                                        <Textarea placeholder="What's happening?" onChange={(e) => setText(e.target.value)} style={{maxHeight: 200}} />
                                    </div>
                                : postType === "image" &&
                                    <div></div>
                                }
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Inital Budget</Label>
                                    <Input id="name" placeholder="Amount" onChange={(e) => setBudget(e.target.value)} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Reward-per-share</Label>
                                    <Input id="name" placeholder="Amount" onChange={(e) => setRewardPerShare(e.target.value)} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Minimum Followers</Label>
                                    <Input id="name" placeholder="e.g. 100" onChange={(e) => setMinFollowers(e.target.value)} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Minimum mirror time</Label>
                                    <Select onValueChange={(newValue) => setPostTime(newValue)}>
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
