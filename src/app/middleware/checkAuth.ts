import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { CookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { JWTUtils } from "../utils/jwt";
import envConfig from "../../config/env";






export const checkAuth = (...authRole: Role[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {

        // session token check

        const sessionToken = CookieUtils.getCookie(req, "better-auth.dinesphere_session_token");

        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized: Missing session token")
        }

        if (sessionToken) {
            const sessionExists = await prisma.session.findUnique({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    user: true
                }
            })

            if (!sessionExists) {
                throw new AppError(status.UNAUTHORIZED, "Unauthorized: Invalid session token")
            }

            if (sessionExists && sessionExists.user) {

                const user = sessionExists.user;
                const now = new Date();

                const createdAt = new Date(sessionExists.createdAt);
                const expiredAt = new Date(sessionExists.expiresAt);

                const sessionLifeTime = expiredAt.getTime() - createdAt.getTime();
                const timeRemaining = expiredAt.getTime() - now.getTime();
                const percentRemaining = (timeRemaining / sessionLifeTime) * 100;





                console.log(sessionLifeTime, "Session lifetime");
                console.log(timeRemaining, "Time remaining");
                console.log(percentRemaining, "Percent remaining");


                if (percentRemaining < 20) {
                    res.setHeader("X-Session-Refresh", "true");
                    res.setHeader("X-Session-Expires-At", expiredAt.toISOString());
                    res.setHeader("X-Session-Percent-Remaining", timeRemaining.toString());
                    console.log("Session expires soon ");

                }

                if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED || user.status === UserStatus.SUSPENDED) {
                    throw new AppError(status.UNAUTHORIZED, "Unauthorized: User is blocked, suspended or deleted")
                }

                if (authRole.length > 0 && !authRole.includes(user.role)) {
                    throw new AppError(status.UNAUTHORIZED, "Unauthorized: User is not authorized to access this resource")

                }

                req.user = {
                    userId: user.id,
                    role: user.role,
                    email: user.email
                }




            }

            const accessToken = CookieUtils.getCookie(req, 'accessToken');
            if (!accessToken) {
                throw new AppError(status.UNAUTHORIZED, "Unauthorized: Missing access token")

            }









        }


        // access token verification

        const accessToken = CookieUtils.getCookie(req, 'accessToken');

        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized: Missing access token")


        }

        const verifiedAccessToken = JWTUtils.verifyToken(accessToken, envConfig.ACCESS_TOKEN_SECRET);

        if (!verifiedAccessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized: Invalid access token")

        }

        if (authRole.length > 0 && !authRole.includes(verifiedAccessToken.data!.role as Role)) {
            throw new AppError(status.FORBIDDEN, "Forbidden: User is not authorized to access this resource")

        }










        next();














    } catch (error) {
        next(error);
    }

}