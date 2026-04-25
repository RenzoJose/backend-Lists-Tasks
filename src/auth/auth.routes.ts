import { Router } from 'express'
import { body, query } from 'express-validator'
import * as authController from './auth.controller.ts'

const router = Router()

const emailValidation = body('email')
  .isEmail().withMessage('El email no es válido')
  .normalizeEmail()

const passwordValidation = body('password')
  .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')

router.post('/register', [emailValidation, passwordValidation], authController.register)
router.post('/login', [emailValidation, passwordValidation], authController.login)

router.get(
  '/verify-email',
  [query('token').notEmpty().withMessage('Token requerido')],
  authController.verifyEmail,
)

router.post(
  '/forgot-password',
  [emailValidation],
  authController.forgotPassword,
)

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token requerido'),
    body('newPassword').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  ],
  authController.resetPassword,
)

export default router

