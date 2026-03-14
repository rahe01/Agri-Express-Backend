import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { TokenUtils } from "../../../utils/token";
import { authService } from "../auth.service";
import { Request, Response } from "express";


export const register = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body;
    const data = await authService.register(payload);
    const { accessToken, refreshToken, token, ...rest } = data;
    TokenUtils.setAccessTokenCookie(res, accessToken);
    TokenUtils.setRefreshTokenCookie(res, refreshToken);
    TokenUtils.setBetterAuthSessionCookie(res, token as string);

    console.log(payload);




    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "User registered successfully",
        data: {
            accessToken,
            refreshToken,
            token,
            ...rest,
        }
    })
});
