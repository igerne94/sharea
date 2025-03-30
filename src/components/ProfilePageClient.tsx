'use client'

import { updateProfile } from '@/actions/profile.action'
import { toggleFollow } from '@/actions/user.action'
import { useUser } from '@clerk/nextjs'
import { format } from 'date-fns'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type User = Awaited<ReturnType<typeof import('@/actions/profile.action').getProfileByName>>
type Posts = Awaited<ReturnType<typeof import('@/actions/profile.action').getUserPosts>>
type LikedPosts = Awaited<ReturnType<typeof import('@/actions/profile.action').getUserLikedPosts>>
interface ProfilePageClientProps {
    user: NonNullable<User>
    posts: Posts
    likedPosts: LikedPosts
    isFollowing: boolean
}

function ProfilePageClient({user, posts, likedPosts, isFollowing: initialIsFollowing }: ProfilePageClientProps) {
    const { user: currentUser } = useUser()
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
    });

    const handleEditSubmit = async () => {
        const formData = new FormData();
        Object.entries(editForm).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const result = await updateProfile(formData);
        if (result.success) {
            setShowEditDialog(false);
            toast.success('Profile updated successfully');
        }
    };

    const handleFollowClick = async () => {
        if (!currentUser) return;

        try {
            setIsUpdatingFollow(true);
            await toggleFollow(user.id)
            setIsFollowing((prev) => !prev);
            toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
            setIsUpdatingFollow(false);
        } catch (error) {
            console.error('Error toggling follow:', error);
            toast.error('Failed to toggle follow');
            setIsUpdatingFollow(false);
        }
    };

    const isOwnProfile = currentUser?.username === user.username ||
        currentUser?.emailAddresses[0]?.emailAddress.split('@')[0] === user.username;
    
    const formattedDate = format(new Date(user.createdAt), 'MMMM yyyy');

    return <div>ProfilePageClient</div>
}

export default ProfilePageClient