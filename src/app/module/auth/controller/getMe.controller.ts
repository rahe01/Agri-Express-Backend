import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { authService } from "../auth.service";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";




export const getMe = catchAsync(
    async(req:Request, res:Response) => {

        const user = req.user;

        const result = await authService.getMe(user);

        sendResponse(res, {
            httpStatusCode:status.OK,
            success:true,
            message:"User retrieved successfully",
            data:result
        })
})
