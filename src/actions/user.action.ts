// server action
"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!user || !userId) return;

        const existingUser = await prisma.user.findUnique({
            where: ({ clerkId: userId }),
        })
        if (existingUser) return existingUser;

        const dbUser = await prisma.user.create({
            data: {
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
            },
        });
        return dbUser;
    } catch (error) { 
        console.error(error);
    }
}

export async function getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
        where: { clerkId },
        include: { 
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true,
                },
            },
         },
    });
}


export async function getDBUserId() {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("User not authenticated");

    const user = await getUserByClerkId(clerkId);
    if (!user) throw new Error("User not found");
    return user.id;
}

// fetch some random users to follow
export async function getRandomUsersFromDB() {
    try {
        const userId = await getDBUserId();
        // get 3 random users except ourselvs and those who we already follow
        const randomUsers = await prisma.user.findMany({
            where: {
                AND: [
                    { NOT: { id: userId } },
                    {
                        NOT: {
                            followers: {
                                some: {
                                    followerId: userId,
                                },
                            }
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                _count: {
                    select: {
                        followers: true,
                    },
                },
            },
            take: 3,
        });
        return randomUsers;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function toggleFollow(targetUserId: string ) {
    try {
        const userId = await getDBUserId();
        if (userId === targetUserId) throw new Error("You can't follow yourself");
        const existingFollow = await prisma.follows.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: targetUserId,
                },
            },
        });
        if (existingFollow) {
            // unfollow
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: userId,
                        followingId: targetUserId,
                    },
                },
            });
        } else {
            // follow
            // transaction - all succedeed (1,2) or nothing
            await prisma.$transaction([
                // #1
                prisma.follows.create({
                    data: {
                        followerId: userId,
                        followingId: targetUserId,
                    },
                }),
                // #2
                prisma.notification.create({
                    data: {
                        type: "FOLLOW",
                        userId: targetUserId,
                        creatorId: userId,
                    },
                }),
            ]);
        }

        // updates UI immediately
        revalidatePath(`/`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Error togling follow" };
    }
}

