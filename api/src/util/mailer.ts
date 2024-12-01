import nodemailer, { Transporter } from 'nodemailer';

const transport : Transporter = nodemailer.createTransport
(
    {
        service: 'Gmail',
        auth:
        {
            user: 'team282024@gmail.com',
            pass: 'qlxo ywlw stkv erjz',
        },
    }
);

export const sendMail = async (to: string, subject: string, text: string) =>
{
    await transport.sendMail
    (
        {
            from: 'team282024@gmail.com',
            to,
            subject,
            text,
        }
    );
};