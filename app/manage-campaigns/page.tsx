'use client'

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"

export default function CardWithForm() {
  return (
<div>
    <Card className="w-[350px] my-6 mx-6">
      <CardHeader>
        <CardTitle>Create promotion</CardTitle>
        <CardDescription>Promote your post.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Textarea placeholder="What's happening?" />
            </div>
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
    <Card className="w-[350px] my-6 mx-6">
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
    
  )
}
