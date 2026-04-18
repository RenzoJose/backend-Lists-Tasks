import { Router } from 'express'
import { body } from 'express-validator'
import * as authController from './auth.controller.ts'

const router = Router()

const emailValidation = body('email')
  .isEmail().withMessage('El email no es válido')
  .normalizeEmail()

const passwordValidation = body('password')
  .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')

router.post('/register', [emailValidation, passwordValidation], authController.register)
router.post('/login', [emailValidation, passwordValidation], authController.login)

export default router
