import { changePassword } from "./controller/changePassword.controller";
import { getMe } from "./controller/getMe.controller";
import { login } from "./controller/login.controller";
import { register } from "./controller/register.controller";
import { verifyEmail } from "./controller/verifyEmail.controller";



export const authController = {
    register,
    login,
    verifyEmail,
    getMe,
    changePassword
};
