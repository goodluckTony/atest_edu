import dotenv from 'dotenv';
dotenv.config();

export const AdminCredentials = {
    admin: {
        email: process.env.ADMIN_EMAIL as string,
        pass: process.env.ADMIN_PASS as string
    }
}