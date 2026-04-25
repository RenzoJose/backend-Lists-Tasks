import { Resend } from 'resend'
import nodemailer from 'nodemailer'

const sendWithMailtrap = async (to: string, subject: string, html: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER!,
      pass: process.env.MAILTRAP_PASS!,
    },
  })

  await transporter.sendMail({
    from: '"Todo App" <noreply@todo-app.dev>',
    to,
    subject,
    html,
  })
}

const sendWithResend = async (to: string, subject: string, html: string): Promise<void> => {
  const resend = new Resend(process.env.RESEND_API_KEY!)
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    html,
  })
}

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const provider = process.env.EMAIL_PROVIDER ?? 'mailtrap'
  if (provider === 'resend') {
    await sendWithResend(to, subject, html)
  } else {
    await sendWithMailtrap(to, subject, html)
  }
}

export const sendVerificationEmail = async (to: string, token: string): Promise<void> => {
  const link = `${process.env.FRONTEND_URL!}/verify-email?token=${token}`
  await sendEmail(
    to,
    'Verifica tu email',
    `
      <h2>Verifica tu cuenta</h2>
      <p>Haz clic en el siguiente enlace para verificar tu email. El enlace expira en 24 horas.</p>
      <a href="${link}">${link}</a>
      <p>Si no creaste esta cuenta, ignora este mensaje.</p>
    `,
  )
}

export const sendPasswordResetEmail = async (to: string, token: string): Promise<void> => {
  const link = `${process.env.FRONTEND_URL!}/reset-password?token=${token}`
  await sendEmail(
    to,
    'Recuperación de contraseña',
    `
      <h2>Recupera tu contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña. El enlace expira en 1 hora.</p>
      <a href="${link}">${link}</a>
      <p>Si no solicitaste esto, ignora este mensaje.</p>
    `,
  )
}
