import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { IRequestuser } from "../../../interface/requestUser.interface";
import { prisma } from "../../../lib/prisma";




export const getMe = async (user: IRequestuser) => {

    const result = await prisma.user.findUnique({
        where: {
            email: user.email,
            id: user.userId

        }

    })

    if (!result) {
        throw new AppError(status.NOT_FOUND, "User Not Found")
    }

    return result;

}