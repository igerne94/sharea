"use server";

import { prisma } from "@/lib/prisma";
import { getDBUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
    try {
        const userId = await getDBUserId();
        
        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: userId,
            },
        });

        revalidatePath("/"); // cash data on demand
        return { success: true, post };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Failed to create a post" };
   }
}