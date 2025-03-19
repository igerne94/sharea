// the parent comonent (server component)

import { getRandomUsersFromDB } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "lucide-react";
import FollowButton from "./FollowButton";

async function YouMayKnow() {
    const youMayKnowUsers = await getRandomUsersFromDB();
  
    if (youMayKnowUsers.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Who to Follow</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {youMayKnowUsers.map((user) => {
                        return (
                            <div key={user.id} className="flex gap-2 items-center justify-between ">
                                <div className="flex items-center gap-1">
                                    <Link href={`/profile/${user.username}`}>
                                        <Avatar>
                                            <AvatarImage src={user.image ?? "./public/avatar.png"} />
                                        </Avatar>
                                    </Link>
                                    <div className="text-xs">
                                        <Link href={`/profile/${user.username}`} className="font-medium cursor-pointer">
                                            {user.name}
                                        </Link>
                                        <p className="text-muted-foreground">@{user.username}</p>
                                        <p className="text-muted-foreground">{user._count.followers} followers</p>
                                    </div>
                                </div>
                                <FollowButton userId={user.id} />
                            </div>);
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export default YouMayKnow