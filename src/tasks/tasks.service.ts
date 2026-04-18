import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! })
})

// Obtener todas las tareas del usuario
export const getAllTasks = async (userId: number) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

// Obtener una tarea por ID (solo si pertenece al usuario)
export const getTaskById = async (id: number, userId: number) => {
  return prisma.task.findUnique({
    where: { id, userId },
  })
}

export const createTask = async (userId: number, data: {
  title: string
  description?: string
  priority?: string
  status?: string
  dueDate?: Date
  category?: string
  order?: number
}) => {
  return prisma.task.create({
    data: { ...data, userId },
  })
}

export const updateTask = async (
  id: number,
  userId: number,
  data: {
    title?: string
    description?: string
    completed?: boolean
    priority?: string
    status?: string
    dueDate?: Date
    category?: string
    order?: number
  }
) => {
  return prisma.task.update({
    where: { id, userId },
    data,
  })
}

// Eliminar una tarea (solo si pertenece al usuario)
export const deleteTask = async (id: number, userId: number) => {
  return prisma.task.delete({
    where: { id, userId },
  })
}
