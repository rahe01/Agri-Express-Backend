import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { authService } from "../auth.service";
import { Request, Response } from "express";



export const verifyEmail = catchAsync(async (req: Request, res: Response) => {

    const payload = req.body;
    const data = await authService.verifyEmail(payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Email verified successfully",
        data
    })
})