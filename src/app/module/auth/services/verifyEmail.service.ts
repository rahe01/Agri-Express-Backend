import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";


export const verifyEmail = async (payload: IEmailVerificationPayload) => {
    const { email, otp } = payload;

    const data = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    })

    if (data.status && !data.user.emailVerified) {
        await prisma.user.update({
            where: {
                email
            },
            data: {
                emailVerified: true
            }

        })

    }

    if (!data) {
        throw new Error("Failed to verify email");
    }





}