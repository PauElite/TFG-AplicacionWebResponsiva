import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    
    await transporter.sendMail({
        from: `"Soporte de la App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Recuperación de contraseña",
        html: `
            <h2>Recuperación de Contraseña</h2>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Este enlace expirará en 15 minutos.</p>
        `
    });

    console.log(`📧 Email de recuperación enviado a: ${email}`);
};