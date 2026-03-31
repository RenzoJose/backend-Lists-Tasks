import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as tasksService from './tasks.service.ts'

// GET /api/tasks
export const getAll = async (req: Request, res: Response) => {
  const tasks = await tasksService.getAllTasks()
  res.json(tasks)
}

// GET /api/tasks/:id
export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const task = await tasksService.getTaskById(id)

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
  const task = await tasksService.createTask({ title, description, priority, status, dueDate, category, order })
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
  const exists = await tasksService.getTaskById(id)

  if (!exists) {
    res.status(404).json({ error: 'Tarea no encontrada' })
    return
  }

  const { title, description, completed, priority, status, dueDate, category, order } = req.body
  const task = await tasksService.updateTask(id, { title, description, completed, priority, status, dueDate, category, order })
  res.json(task)
}



// DELETE /api/tasks/:id
export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const exists = await tasksService.getTaskById(id)

  if (!exists) {
    res.status(404).json({ error: 'Tarea no encontrada' })
    return
  }

  await tasksService.deleteTask(id)
  res.status(204).send()
}
