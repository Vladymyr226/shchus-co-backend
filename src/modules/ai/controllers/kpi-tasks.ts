import { ExpressRequest } from '../middlewares/user.auth'
import { Response } from 'express'
import db from '../../../db/knexKonfig'

// Получение всех KPI задач пользователя
export const getKpiTasks = async (req: ExpressRequest, res: Response) => {
  const user_id = req.user_id

  try {
    const tasks = await db('kpi-tasks')
      .where({ user_id })
      .orderBy('created_at', 'desc')
      .select('*')

    res.status(200).json(tasks)
  } catch (error) {
    console.error('Error in getKpiTasks:', error)
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    })
  }
}

// Создание новой KPI задачи
export const createKpiTask = async (req: ExpressRequest, res: Response) => {
  const user_id = req.user_id
  const { text } = req.body

  try {
    const [newTask] = await db('kpi-tasks')
      .insert({
        user_id,
        text,
        is_completed: false,
      })
      .returning('*')

    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error in createKpiTask:', error)
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    })
  }
}

// Обновление KPI задачи
export const updateKpiTask = async (req: ExpressRequest, res: Response) => {
  const user_id = req.user_id
  const { id } = req.params
  const updateData = req.body

  try {
    // Проверяем, что задача принадлежит пользователю
    const existingTask = await db('kpi-tasks')
      .where({ id, user_id })
      .first()

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Задача не найдена'
      })
    }

    // Подготавливаем данные для обновления
    const updateFields: any = {
      ...updateData,
      updated_at: db.fn.now()
    }

    const [updatedTask] = await db('kpi-tasks')
      .where({ id, user_id })
      .update(updateFields)
      .returning('*')

    res.status(200).json(updatedTask)
  } catch (error) {
    console.error('Error in updateKpiTask:', error)
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    })
  }
}

// Удаление KPI задачи
export const deleteKpiTask = async (req: ExpressRequest, res: Response) => {
  const user_id = req.user_id
  const { id } = req.params

  try {
    // Проверяем, что задача принадлежит пользователю
    const existingTask = await db('kpi-tasks')
      .where({ id, user_id })
      .first()

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: 'Задача не найдена'
      })
    }

    await db('kpi-tasks')
      .where({ id, user_id })
      .delete()

    res.status(200).json({
      success: true,
      message: 'Задача успешно удалена'
    })
  } catch (error) {
    console.error('Error in deleteKpiTask:', error)
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    })
  }
}
