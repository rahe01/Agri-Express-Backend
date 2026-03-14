import { NextFunction, Request, Response } from "express";
import { z, ZodTypeAny } from "zod";

export const validateRequest = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Handle multipart/form-data case
            if (req.body?.data) {
                try {
                    req.body = JSON.parse(req.body.data);
                } catch {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid JSON format in 'data' field",
                    });
                }
            }

            const result = schema.safeParse(req.body);

            if (!result.success) {
                const formattedErrors = result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }));

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: formattedErrors,
                });
            }

            req.body = result.data;
            next();
        } catch (error) {
            next(error);
        }
    };
};