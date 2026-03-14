import { auth } from "../../../lib/auth";
import { TokenUtils } from "../../../utils/token";


 
export const login = async (payload: any) => {

    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    })

    if (!data) {
        throw new Error("Failed to login user");
    }


    const newAccessToken = TokenUtils.getAccessToken({
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,

    })

    const newRefreshToken = TokenUtils.getRefreshToken({
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,

    })

    return {
        ...data,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken

    };

};


