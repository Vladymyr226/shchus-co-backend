import { Response } from 'express'
import db from '../../../db/knexKonfig'
import { ExpressRequest } from '../middlewares/user.auth'

export async function myNotesPost(req: ExpressRequest, res: Response) {
  const { image, transcribe_text } = req.query
  const user_id = req.user_id

  if (!image && !transcribe_text) {
    return res.status(400).json({ message: 'One field is required' })
  }

  try {
    const [note] = await db('notes-ai')
      .insert({ transcribe_text: transcribe_text || null, user_id })
      .returning('*')
    if (image) {
      await db('photos-ai').insert({ note_id: note.id, url: image }).returning('*')
    }
    res.status(201).json({ success: true, note })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function myNotesPut(req: ExpressRequest, res: Response) {
  const { image, transcribe_text, note_id } = req.query
  const user_id = req.user_id

  if (!image && !transcribe_text) {
    return res.status(400).json({ message: 'One field is required' })
  }

  try {
    if (transcribe_text) {
      await db('notes-ai')
        .where({ id: note_id })
        .where({ user_id })
        .update({ transcribe_text, updated_at: db.fn.now() })
        .returning('*')
    }
    if (image) {
      await db('photos-ai').insert({ note_id, url: image }).returning('*')
    }
    res.status(201).json({ success: true })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function myNotesDelete(req: ExpressRequest, res: Response) {
  const { id } = req.params
  const user_id = req.user_id

  if (!id) {
    return res.status(400).json({ message: 'Note ID is required' })
  }

  try {
    // Проверяем, существует ли заметка и принадлежит ли она пользователю
    const note = await db('notes-ai').where({ id, user_id }).first()

    if (!note) {
      return res.status(404).json({ message: 'Note not found or access denied' })
    }

    // Удаляем связанные фотографии
    await db('photos-ai').where({ note_id: id }).del()

    // Удаляем саму заметку
    await db('notes-ai').where({ id }).del()

    return res.status(200).json({ success: true, message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error in deleteNote:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function myGoalsPost(req: ExpressRequest, res: Response) {
  const { image, transcribe_text } = req.query
  const user_id = req.user_id

  if (!image && !transcribe_text) {
    return res.status(400).json({ message: 'One field is required' })
  }

  try {
    const [goal] = await db('goals-ai')
      .insert({ transcribe_text: transcribe_text || null, user_id })
      .returning('*')
    if (image) {
      await db('photos-ai').insert({ goal_id: goal.id, url: image }).returning('*')
    }
    res.status(201).json({ success: true, goal })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function myGoalsPut(req: ExpressRequest, res: Response) {
  const { image, transcribe_text, goal_id, is_completed } = req.query
  const user_id = req.user_id

  if (!image && !transcribe_text && !is_completed) {
    return res.status(400).json({ message: 'One field is required' })
  }

  try {
    if (transcribe_text || is_completed) {
      await db('goals-ai')
        .where({ id: goal_id })
        .where({ user_id })
        .modify(q => {
          if (transcribe_text) q.update({ transcribe_text })
          if (is_completed) q.update({ is_completed })
        })
        .update({ updated_at: db.fn.now() })
        .returning('*')
    }
    if (image) {
      await db('photos-ai').insert({ goal_id, url: image }).returning('*')
    }
    res.status(201).json({ success: true })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function myGoalsDelete(req: ExpressRequest, res: Response) {
  const { id } = req.params
  const user_id = req.user_id

  if (!id) {
    return res.status(400).json({ message: 'Note ID is required' })
  }

  try {
    const goal = await db('goals-ai').where({ id, user_id }).first()

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or access denied' })
    }

    await db('photos-ai').where({ goal_id: id }).del()
    await db('goals-ai').where({ id }).del()

    return res.status(200).json({ success: true, message: 'Goal deleted successfully' })
  } catch (error) {
    console.error('Error in deleteGoal:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function myTasksPost(req: ExpressRequest, res: Response) {
  const { image, transcribe_text } = req.query
  const user_id = req.user_id

  if (!image && !transcribe_text) {
    return res.status(400).json({ message: 'One field is required' })
  }

  try {
    const [task] = await db('tasks-ai')
      .insert({ transcribe_text: transcribe_text || null, user_id })
      .returning('*')
    if (image) {
      await db('photos-ai').insert({ task_id: task.id, url: image }).returning('*')
    }
    res.status(201).json({ success: true, task })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function myTasksPut(req: ExpressRequest, res: Response) {
  const { image, transcribe_text, task_id, is_completed } = req.query
  const user_id = req.user_id

  if (!image && !transcribe_text && !is_completed) {
    return res.status(400).json({ message: 'One field is required' })
  }

  try {
    if (transcribe_text || is_completed) {
      await db('tasks-ai')
        .where({ id: task_id })
        .where({ user_id })
        .modify(q => {
          if (transcribe_text) q.update({ transcribe_text })
          if (is_completed) q.update({ is_completed })
        })
        .update({ updated_at: db.fn.now() })
        .returning('*')
    }
    if (image) {
      await db('photos-ai').insert({ task_id, url: image }).returning('*')
    }
    res.status(201).json({ success: true })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function myTasksDelete(req: ExpressRequest, res: Response) {
  const { id } = req.params
  const user_id = req.user_id

  if (!id) {
    return res.status(400).json({ message: 'Task ID is required' })
  }

  try {
    const task = await db('tasks-ai').where({ id, user_id }).first()

    if (!task) {
      return res.status(404).json({ message: 'Task not found or access denied' })
    }

    await db('photos-ai').where({ task_id: id }).del()
    await db('tasks-ai').where({ id }).del()

    return res.status(200).json({ success: true, message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error in deleteTask:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function myDeadlinesPost(req: ExpressRequest, res: Response) {
  const { image, transcribe_text } = req.query
  const user_id = req.user_id

  if (!image && !transcribe_text) {
    return res.status(400).json({ message: 'One field is required' })
  }

  try {
    const [deadline] = await db('deadlines-ai')
      .insert({ transcribe_text: transcribe_text || null, user_id })
      .returning('*')
    if (image) {
      await db('photos-ai').insert({ deadline_id: deadline.id, url: image }).returning('*')
    }
    res.status(201).json({ success: true, deadline })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function myDeadlinesPut(req: ExpressRequest, res: Response) {
  const { image, transcribe_text, deadline_id, is_completed, date_time_at } = req.query
  const user_id = req.user_id

  if (!image && !transcribe_text && !is_completed && !date_time_at) {
    return res.status(400).json({ message: 'One field is required' })
  }

  try {
    if (transcribe_text || is_completed || date_time_at) {
      await db('deadlines-ai')
        .where({ id: deadline_id })
        .where({ user_id })
        .modify(q => {
          if (transcribe_text) q.update({ transcribe_text })
          if (is_completed) q.update({ is_completed })
          if (date_time_at) q.update({ date_time_at })
        })
        .update({ updated_at: db.fn.now() })
        .returning('*')
    }
    if (image) {
      await db('photos-ai').insert({ deadline_id, url: image }).returning('*')
    }
    res.status(201).json({ success: true })
  } catch (error) {
    console.error('Error in notes.ts', error)
    return res.status(400).json({ message: error })
  }
}

export async function myDeadlinesDelete(req: ExpressRequest, res: Response) {
  const { id } = req.params
  const user_id = req.user_id

  if (!id) {
    return res.status(400).json({ message: 'Deadline ID is required' })
  }

  try {
    const deadline = await db('deadlines-ai').where({ id, user_id }).first()

    if (!deadline) {
      return res.status(404).json({ message: 'Deadline not found or access denied' })
    }

    await db('photos-ai').where({ deadline_id: id }).del()
    await db('deadlines-ai').where({ id }).del()

    return res.status(200).json({ success: true, message: 'Deadline deleted successfully' })
  } catch (error) {
    console.error('Error in deleteDeadline:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function myNotesAll(req: ExpressRequest, res: Response) {
  const user_id = req.user_id

  try {
    const [notes, goals, tasks, deadlines] = await Promise.all([
      db('notes-ai')
        .leftJoin('photos-ai', 'notes-ai.id', 'photos-ai.note_id')
        .where('notes-ai.user_id', user_id)
        .select(
          'notes-ai.id',
          'notes-ai.transcribe_text as transcribeText',
          db.raw(`
            COALESCE(json_agg("photos-ai".url) FILTER (WHERE "photos-ai".id IS NOT NULL), '[]') as image
          `)
        )
        .groupBy('notes-ai.id')
        .orderBy('notes-ai.created_at', 'desc'),

      db('goals-ai')
        .leftJoin('photos-ai', 'goals-ai.id', 'photos-ai.goal_id')
        .where('goals-ai.user_id', user_id)
        .select(
          'goals-ai.id',
          'goals-ai.transcribe_text as transcribeText',
          'goals-ai.is_completed as isCompleted',
          db.raw(`
            COALESCE(json_agg("photos-ai".url) FILTER (WHERE "photos-ai".id IS NOT NULL), '[]') as image
          `)
        )
        .groupBy('goals-ai.id')
        .orderBy('goals-ai.created_at', 'desc'),

      db('tasks-ai')
        .leftJoin('photos-ai', 'tasks-ai.id', 'photos-ai.task_id')
        .where('tasks-ai.user_id', user_id)
        .select(
          'tasks-ai.id',
          'tasks-ai.transcribe_text as transcribeText',
          'tasks-ai.is_completed as isCompleted',
          db.raw(`
            COALESCE(json_agg("photos-ai".url) FILTER (WHERE "photos-ai".id IS NOT NULL), '[]') as image
          `)
        )
        .groupBy('tasks-ai.id')
        .orderBy('tasks-ai.created_at', 'desc'),

      db('deadlines-ai')
        .leftJoin('photos-ai', 'deadlines-ai.id', 'photos-ai.deadline_id')
        .where('deadlines-ai.user_id', user_id)
        .select(
          'deadlines-ai.id',
          'deadlines-ai.transcribe_text as transcribeText',
          'deadlines-ai.is_completed as isCompleted',
          'deadlines-ai.date_time_at as dateTime',
          db.raw(`
            COALESCE(json_agg("photos-ai".url) FILTER (WHERE "photos-ai".id IS NOT NULL), '[]') as image
          `)
        )
        .groupBy('deadlines-ai.id')
        .orderBy('deadlines-ai.created_at', 'desc'),
    ])

    return res.status(200).json({
      success: true,
      notes,
      goals,
      tasks,
      deadlines,
    })
  } catch (error) {
    console.error('Error in myNotesAll:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
