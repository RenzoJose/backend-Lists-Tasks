import 'dotenv/config'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { sendVerificationEmail, sendPasswordResetEmail } from '../email/email.service.ts'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

const generateToken = (): string => crypto.randomBytes(32).toString('hex')
const hashToken = (token: string): string => crypto.createHash('sha256').update(token).digest('hex')

export const register = async (email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('El email ya está registrado')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const token = generateToken()
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      emailVerified: false,
      emailVerificationToken: hashToken(token),
      emailVerificationExpiry: expiry,
    },
  })

  await sendVerificationEmail(email, token)

  return { message: 'Registro exitoso. Revisa tu email para verificar tu cuenta.' }
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Credenciales inválidas')
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw new Error('Credenciales inválidas')
  }

  if (!user.emailVerified) {
    const err = new Error('Debes verificar tu email antes de iniciar sesión')
    ;(err as any).statusCode = 403
    throw err
  }

  const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  return { token: jwtToken, user: { id: user.id, email: user.email } }
}

export const verifyEmail = async (token: string) => {
  const hashed = hashToken(token)
  const user = await prisma.user.findUnique({ where: { emailVerificationToken: hashed } })

  if (!user) {
    throw new Error('Token inválido')
  }

  if (!user.emailVerificationExpiry || user.emailVerificationExpiry < new Date()) {
    const err = new Error('El token ha expirado')
    ;(err as any).statusCode = 410
    throw err
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    },
  })

  return { message: 'Email verificado correctamente' }
}

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    const token = generateToken()
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1h

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashToken(token),
        passwordResetExpiry: expiry,
      },
    })

    await sendPasswordResetEmail(email, token)
  }

  return { message: 'Si el email existe, recibirás un correo con instrucciones.' }
}

export const resetPassword = async (token: string, newPassword: string) => {
  const hashed = hashToken(token)
  const user = await prisma.user.findUnique({ where: { passwordResetToken: hashed } })

  if (!user) {
    throw new Error('Token inválido')
  }

  if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
    const err = new Error('El token ha expirado')
    ;(err as any).statusCode = 410
    throw err
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  })

  return { message: 'Contraseña actualizada correctamente' }
}
