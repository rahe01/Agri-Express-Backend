
interface IEmailVerificationPayload {
    email: string;
    otp: string;
}


interface IChangePasswordPayload{
    oldPassword: string;
    newPassword: string;

    
}