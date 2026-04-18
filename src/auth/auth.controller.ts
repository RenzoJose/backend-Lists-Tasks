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
    res.status(401).json({ error: err.message })
  }
}
