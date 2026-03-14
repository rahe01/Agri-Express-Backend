import { JwtPayload, SignOptions } from "jsonwebtoken";
import { JWTUtils } from "./jwt";
import envConfig from "../../config/env";
import { CookieUtils } from "./cookie";
import { Response } from "express";

// Default cookie options
const DEFAULT_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none" as const,
    path: "/",
};

const getAccessToken = (payload: JwtPayload) => {
    return JWTUtils.createToken(
        payload,
        envConfig.ACCESS_TOKEN_SECRET,
        { expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN } as SignOptions
    );
};

const getRefreshToken = (payload: JwtPayload) => {
    return JWTUtils.createToken(
        payload,
        envConfig.REFRESH_TOKEN_SECRET,
        { expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN } as SignOptions
    );
};

const setAccessTokenCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, "accessToken", token, {
        ...DEFAULT_COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, "refreshToken", token, {
        ...DEFAULT_COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
    CookieUtils.setCookie(res, "better-auth.dinesphere_session_token", token, {
        ...DEFAULT_COOKIE_OPTIONS,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
};

// Optional: remove Better Auth session cookie if you migrate fully to JWT
const clearBetterAuthSessionCookie = (res: Response) => {
    CookieUtils.setCookie(res, "better-auth.session_token", "", {
        ...DEFAULT_COOKIE_OPTIONS,
        maxAge: 0,
    });
};

export const TokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    clearBetterAuthSessionCookie, // safer than setting manually
    setBetterAuthSessionCookie
};