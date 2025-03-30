import { getProfileByName, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action"
import ProfilePageClient from "@/components/ProfilePageClient"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { username: string } }) { 
    const user = await getProfileByName(params.username)
    if (!user) return 
    
    return {
        title: user.name ?? user.username,
        description: user.bio ?? `Check out ${user.username}'s profile`,
    }
}

async function ProfilePageServer({ params }: { params: { username: string } }) {
    const userRes = await getProfileByName(params.username)

    if (!userRes) notFound();

    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
        getUserPosts(userRes.id),
        getUserLikedPosts(userRes.id),
        isFollowing(userRes.id),
    ]);
    
    return <ProfilePageClient
        user={userRes}
        posts={posts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollowing}
    />
}
export default ProfilePageServer