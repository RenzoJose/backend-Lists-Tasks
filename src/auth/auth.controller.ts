import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as authService from './auth.service.ts'

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const { email, password } = req.body
  try {
    const result = await authService.register(email, password)
    res.status(201).json(result)
  } catch (err: any) {
    res.status(409).json({ error: err.message })
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const { email, password } = req.body
  try {
    const result = await authService.login(email, password)
    res.json(result)
  } catch (err: any) {
    const status = err.statusCode ?? 401
    res.status(status).json({ error: err.message })
  }
}

// GET /api/auth/verify-email?token=xxx
export const verifyEmail = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const { token } = req.query as { token: string }
  try {
    const result = await authService.verifyEmail(token)
    res.json(result)
  } catch (err: any) {
    const status = err.statusCode ?? 400
    res.status(status).json({ error: err.message })
  }
}

// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const { email } = req.body
  try {
    const result = await authService.forgotPassword(email)
    res.json(result)
  } catch {
    res.json({ message: 'Si el email existe, recibirás un correo con instrucciones.' })
  }
}

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const { token, newPassword } = req.body
  try {
    const result = await authService.resetPassword(token, newPassword)
    res.json(result)
  } catch (err: any) {
    const status = err.statusCode ?? 400
    res.status(status).json({ error: err.message })
  }
}

