"use client";
import { createComment, getPosts, toggleLike } from '@/actions/post.action';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];


function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null}) {
    const { user } = useUser();
    const [newComment, setNewComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === dbUserId));
    const [optimisticLikesCount, setOptimisticLikesCount] = useState(post._count.likes);

    const handleLike = async () => { 
        if (isLiking) return;
        try {
            setIsLiking(true);
            setHasLiked(prev => !prev);
            setOptimisticLikesCount(prev => prev + (hasLiked ? -1 : 1));
            await toggleLike(post.id);
        } catch (error) {
            setOptimisticLikesCount(post._count.likes);
            setHasLiked(post.likes.some((like) => like.userId === dbUserId));
            console.error("Error during liking", error);
        } finally {
            setIsLiking(false);
        }
    }

    const handleComment: string = async () => {
        if (!newComment || isCommenting) return;
        try {
            setIsCommenting(true);
            const res = await createComment(post.id, newComment);
            if (res?.success) {
                toast.success("Comment added successfully");
                setNewComment("");
            }
        } catch (error) {
            toast.error("Error adding comment");
            console.error("Error adding comment", error);
        } finally {
            setIsCommenting(false);
        }
     }

    const handleDeletePost = async () => { 
        if (isDeleting) return;
        try {
            setIsDeleting(true);
            const res = await deletePost(post.id);
            if (res?.success) {
                toast.success("Post deleted successfully");
            } else {
                throw new Error("Error deleting post");
            }
        } catch (error) {
            console.error("Error deleting post", error);
        } finally {
            setIsDeleting(false);
        }
    }
    
    return (
        <div>PostCard</div>
    );
}

export default PostCard