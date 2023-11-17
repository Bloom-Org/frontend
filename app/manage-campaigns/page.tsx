'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import styles from "./manage-camapigns.module.css";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select"
import { useState } from "react"

export default function ManageCampaigns() {
    const [postType, setPostType] = useState<string>("");
    console.log(postType);
    return (
        <div className={styles.container}>
            <Card className="w-[68%] min-w-[350px] my-4" > 
            
            </Card>
            <div className="w-[28%] min-w-[350px]">
                <Card className="w-[100%] my-4">
                <CardHeader>
                    <CardTitle>Create a post</CardTitle>
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
                                    <Textarea placeholder="What's happening?" />
                                </div>
                            : postType === "image" &&
                                <div></div>
                            }
                             <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Inital Budget</Label>
                            <Input id="name" placeholder="Amount" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Reward-per-share</Label>
                            <Input id="name" placeholder="Amount" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Minimum Followers</Label>
                            <Input id="name" placeholder="e.g. 100" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Deadline</Label>
                            <Input id="name" placeholder="MM/TT/YYYY" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Post</Button>
                </CardFooter>
                </Card>
                <Card className="w-[100%] my-4">
                <CardHeader>
                    <CardTitle>Create promotion</CardTitle>
                    <CardDescription>Promote your post.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                    <div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Deadline</Label>
                        <Input id="name" placeholder="MM/TT/YYYY" />
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="destructive">End Promotion</Button>
                    <Button>Deposit</Button>
                    <Button variant="outline">Withdraw</Button>
                </CardFooter>
                </Card>
            </div>
        </div>    
    );
}
