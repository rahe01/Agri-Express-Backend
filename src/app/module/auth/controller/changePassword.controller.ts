import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "../auth.service";
import { TokenUtils } from "../../../utils/token";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";




export const changePassword = catchAsync(
    async(req:Request, res:Response) => {
        const payload = req.body;
        const betterAuthSessionToken = req.cookies["better-auth.dinesphere_session_token"];
        const result = await authService.changePassword(payload, betterAuthSessionToken);

        const { accessToken, refreshToken, token, ...rest } = result;

        TokenUtils.setAccessTokenCookie(res, accessToken);
        TokenUtils.setRefreshTokenCookie(res, refreshToken);
        TokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode:status.OK,
            success:true,
            message:"Password changed successfully",
            data:{
                accessToken,
                refreshToken,
                token,
                ...rest
            }
        })



    }
)