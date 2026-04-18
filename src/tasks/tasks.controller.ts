import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as tasksService from './tasks.service.ts'

// GET /api/tasks
export const getAll = async (req: Request, res: Response) => {
  const tasks = await tasksService.getAllTasks(req.user!.id)
  res.json(tasks)
}

// GET /api/tasks/:id
export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const task = await tasksService.getTaskById(id, req.user!.id)

  if (!task) {
    res.status(404).json({ error: 'Tarea no encontrada' })
    return
  }

  res.json(task)
}

// POST /api/tasks
export const create = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const { title, description, priority, status, dueDate, category, order } = req.body
  const task = await tasksService.createTask(req.user!.id, { title, description, priority, status, dueDate, category, order })
  res.status(201).json(task)
}

// PUT /api/tasks/:id
export const update = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const id = Number(req.params.id)
  const { title, description, completed, priority, status, dueDate, category, order } = req.body

  try {
    const task = await tasksService.updateTask(id, req.user!.id, { title, description, completed, priority, status, dueDate, category, order })
    res.json(task)
  } catch {
    res.status(404).json({ error: 'Tarea no encontrada' })
  }
}

// DELETE /api/tasks/:id
export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  try {
    await tasksService.deleteTask(id, req.user!.id)
    res.status(204).send()
  } catch {
    res.status(404).json({ error: 'Tarea no encontrada' })
  }
}

