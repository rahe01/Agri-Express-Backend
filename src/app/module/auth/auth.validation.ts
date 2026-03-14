import { z } from "zod";
import { UserRole } from "../../../generated/prisma/enums";


const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

const registerUserZodSchema = z.object({
    name: z
        .string({ error: "Name is required" })
        .trim()
        .min(3, { error: "Name must be at least 3 characters long" })
        .max(50, { error: "Name cannot exceed 50 characters" })
        .regex(/^[a-zA-Z\s]+$/, {
            error: "Name can only contain letters and spaces",
        }),

    email: z
        .string({ error: "Email is required" })
        .trim()
        .toLowerCase()
        .email({ error: "Please provide a valid email address" }),

    password: z
        .string({ error: "Password is required" })
        .min(8, { error: "Password must be at least 8 characters long" })
        .max(100, { error: "Password cannot exceed 100 characters" })
        .regex(strongPasswordRegex, {
            error:
                "Password must contain uppercase, lowercase, number and special character",
        }),

    role: z
        .enum(UserRole)
        .optional()
        .default("FARMER"),
});


const loginUserZodSchema = z.object({
    email: z
        .string({ error: "Email is required" })
        .trim()
        .toLowerCase()
        .email({ error: "Invalid email format" }),

    password: z
        .string({ error: "Password is required" })
        .min(6, { error: "Password must be at least 6 characters" })
        .max(100, { error: "Password cannot exceed 100 characters" }),
});



const changePasswordZodSchema = z.object({
    oldPassword: z
        .string({ error: "Old password is required" })
        .min(6, { error: "Old password must be at least 6 characters" })
        .max(100, { error: "Old password cannot exceed 100 characters" }),

    newPassword: z
        .string({ error: "New password is required" })
        .min(6, { error: "New password must be at least 6 characters" })
        .max(100, { error: "New password cannot exceed 100 characters" })   
});


export const authValidation = {
    registerUserZodSchema,
    loginUserZodSchema,
    changePasswordZodSchema

}