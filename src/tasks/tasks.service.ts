import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! })
})
// Obtener todas las tareas
export const getAllTasks = async () => {
  return prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

// Obtener una tarea por ID
export const getTaskById = async (id: number) => {
  return prisma.task.findUnique({
    where: { id },
  })
}

export const createTask = async (data: {
  title: string
  description?: string
  priority?: string
  status?: string
  dueDate?: Date
  category?: string
  order?: number
}) => {
  return prisma.task.create({
    data,
  })
}

export const updateTask = async (
  id: number,
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
    where: { id },
    data,
  })
}

// Eliminar una tarea
export const deleteTask = async (id: number) => {
  return prisma.task.delete({
    where: { id },
  })
}
