import status from "http-status"
import AppError from "../../../errorHelpers/AppError"
import { auth } from "../../../lib/auth"
import { TokenUtils } from "../../../utils/token"




export const changePassword = async (payload: IChangePasswordPayload, sessionToken: string) => {

    const session = await auth.api.getSession({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })

    if (!session) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }
    const { oldPassword, newPassword } = payload;


    const result = await auth.api.changePassword({
        body: {
            currentPassword: oldPassword,
            newPassword: newPassword,
            revokeOtherSessions: true

        },
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })


    const accessToken = TokenUtils.getAccessToken({

        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified


    })
    const refreshToken = TokenUtils.getRefreshToken({
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified

    })


    return {
        ...result,
        accessToken,
        refreshToken

    }





}