import { register } from "./services/register.service"
import { login } from "./services/login.service"
import { verifyEmail } from "./services/verifyEmail.service";
import { getMe } from "./services/getMe.service";
import { changePassword } from "./services/changePassword.service";




export const authService = {
    register,
    login,
    verifyEmail,
    getMe,
    changePassword

}