import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { TokenUtils } from "../../../utils/token";
import { authService } from "../auth.service";
import { Request, Response } from "express";



export const login = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body;
    const data = await authService.login(payload);
    const { accessToken, refreshToken, token, ...rest } = data;




    TokenUtils.setAccessTokenCookie(res, accessToken);
    TokenUtils.setRefreshTokenCookie(res, refreshToken);
    TokenUtils.setBetterAuthSessionCookie(res, token as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    })
})