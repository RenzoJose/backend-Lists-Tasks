import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' })
    return
  }

  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string }
    req.user = { id: payload.id, email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
