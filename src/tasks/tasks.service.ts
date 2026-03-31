import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../../generated/prisma/client.ts'

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

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
