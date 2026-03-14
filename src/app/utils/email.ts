import nodemailer from 'nodemailer';
import path from 'path';
import envConfig from '../../config/env';
import ejs from 'ejs';
import { SendEmailOptions } from '../interface/email.interface';


const transporter = nodemailer.createTransport({
    host: envConfig.EMAIL_SENDER_SMTP_HOST,
    port: Number(envConfig.EMAIL_SENDER_SMTP_PORT),
    secure: false,
    auth: {
        user: envConfig.EMAIL_SENDER_SMTP_USER,
        pass: envConfig.EMAIL_SENDER_SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false, // development/test only
    }
});



export const sendEmail = async ({ to, subject, templateName, templateData, attachments }: SendEmailOptions) => {

    try {

        const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData);


        const info = await transporter.sendMail({
            from: envConfig.EMAIL_SENDER_SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            }))

        })


        console.log(`Email send to ${to} : ${info}`);



    } catch (error: any) {
        console.log("Emain sending Error ", error.message);
        throw new Error(error.message);



    }

}
