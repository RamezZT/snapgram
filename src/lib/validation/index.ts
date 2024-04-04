import { z } from "zod";


export const SignupValidation = z.object({
    name: z.string().min(2, { message: 'Too short' }),
    username: z.string().min(2, { message: 'Too short' }),
    email: z.string().min(2),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
});

export const SigninValidation = z.object({
    email: z.string().min(2),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
});
export const PostValidation = z.object({
    caption: z.string().min(2, {
        message: "caption must be at least 2 characters.",
    }),
    tags: z.string(),
    location: z.string().min(2).max(100),
    file: z.custom<File[]>(),
});

export const EditPostValidation = z.object({
    name: z.string().min(2).max(50),
    username: z.string().min(2).max(50),
    email: z.string().min(3).max(50),
    bio: z.string().max(200)
});