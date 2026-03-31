import { Router } from 'express'
import { body } from 'express-validator'
import * as tasksController from './tasks.controller.ts'

const router = Router()

// ── Validaciones ──────────────────────────────────────────
const titleRequired = body('title')
  .notEmpty().withMessage('El campo title es requerido')
  .isString().withMessage('El campo title debe ser texto')

const titleOptional = body('title')
  .optional()
  .notEmpty().withMessage('El campo title no puede estar vacío')
  .isString().withMessage('El campo title debe ser texto')

const priorityOptional = body('priority')
  .optional()
  .isIn(['low', 'medium', 'high'])
  .withMessage('priority debe ser low, medium o high')

const statusOptional = body('status')
  .optional()
  .isIn(['pending', 'in_progress', 'done'])
  .withMessage('status debe ser pending, in_progress o done')

const dueDateOptional = body('dueDate')
  .optional()
  .isISO8601()
  .withMessage('dueDate debe ser una fecha válida (ISO 8601)')

// ── Rutas ─────────────────────────────────────────────────
router.get('/', tasksController.getAll)
router.get('/:id', tasksController.getById)
router.post('/', [titleRequired, priorityOptional, statusOptional, dueDateOptional], tasksController.create)
router.put('/:id', [titleOptional, priorityOptional, statusOptional, dueDateOptional], tasksController.update)
router.delete('/:id', tasksController.remove)

export default router