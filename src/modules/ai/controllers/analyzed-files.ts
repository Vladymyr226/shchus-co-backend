import { Response } from 'express'
import db from '../../../db/knexKonfig'
import { ExpressRequest } from '../middlewares/user.auth'

export async function analyzedFilesPost(req: ExpressRequest, res: Response) {
  const { files } = req.body
  const user_id = req.user_id

  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ message: 'Files array is required and must not be empty' })
  }

  try {
    const insertedFiles: any[] = []

    for (const file of files) {
      const [insertedFile] = await db('analyzed-files-ai')
        .insert({
          user_id,
          file_name: file.fileName,
          file_size: file.fileSize,
          file_type: file.fileType,
          s3_url: file.s3Url,
          summary: file.analysis.summary,
          tags: JSON.stringify(file.analysis.tags),
          category: file.analysis.category,
          importance: String(file.analysis.importance),
          key_points: JSON.stringify(file.analysis.keyPoints),
          technical_details: file.analysis.technicalDetails || null,
          data_points: file.analysis.dataPoints || null,
          is_large_file: file.isLargeFile,
          total_lines: file.totalLines,
          is_public: file.isPublic
        })
        .returning('*')

      insertedFiles.push(insertedFile)
    }

    res.status(201).json({ 
      success: true, 
      message: `${insertedFiles.length} files analyzed and saved successfully`,
      files: insertedFiles 
    })
  } catch (error) {
    console.error('Error in analyzedFilesPost:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function analyzedFilesGet(req: ExpressRequest, res: Response) {
  const user_id = req.user_id
  const { 
    page = 1, 
    limit = 10
  } = req.query

  try {
    const query = db('analyzed-files-ai')
      .where({ user_id, is_public: false })
      .orderBy('importance', 'desc')
      .orderBy('created_at', 'desc')

    // Пагинация
    const offset = (Number(page) - 1) * Number(limit)
    const files = await query
      .limit(Number(limit))
      .offset(offset)
      .select('*')

    // Получаем общее количество записей для пагинации
    const [{ count }] = await db('analyzed-files-ai')
      .where({ user_id, is_public: false })
      .count('* as count')

    // Парсим JSON поля с безопасной обработкой и форматируем ответ
    const parsedFiles = files.map(file => ({
      id: file.id,
      fileName: file.file_name,
      fileSize: file.file_size,
      fileType: file.file_type,
      s3Url: file.s3_url,
      isLargeFile: file.is_large_file,
      totalLines: file.total_lines,
      isPublic: file.is_public,
      createdAt: file.created_at,
      updatedAt: file.updated_at,
      analysis: {
        summary: file.summary || 'Нет описания',
        tags: file.tags ? (typeof file.tags === 'string' ? JSON.parse(file.tags) : file.tags) : [],
        category: file.category || 'Не указана',
        importance: typeof file.importance === 'string' ? parseInt(file.importance) : (file.importance || 0),
        keyPoints: file.key_points ? (typeof file.key_points === 'string' ? JSON.parse(file.key_points) : file.key_points) : [],
        technicalDetails: file.technical_details || '',
        dataPoints: file.data_points || ''
      }
    }))

    res.status(200).json({
      success: true,
      files: parsedFiles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(count),
        totalPages: Math.ceil(Number(count) / Number(limit))
      }
    })
  } catch (error) {
    console.error('Error in analyzedFilesGet:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function analyzedFileGetById(req: ExpressRequest, res: Response) {
  const { id } = req.params
  const user_id = req.user_id

  if (!id) {
    return res.status(400).json({ message: 'File ID is required' })
  }

  try {
    const file = await db('analyzed-files-ai')
      .where({ id, user_id })
      .first()

    if (!file) {
      return res.status(404).json({ message: 'File not found or access denied' })
    }

    // Парсим JSON поля с безопасной обработкой и форматируем ответ
    const parsedFile = {
      id: file.id,
      fileName: file.file_name,
      fileSize: file.file_size,
      fileType: file.file_type,
      s3Url: file.s3_url,
      isLargeFile: file.is_large_file,
      totalLines: file.total_lines,
      isPublic: file.is_public,
      createdAt: file.created_at,
      updatedAt: file.updated_at,
      analysis: {
        summary: file.summary || 'Нет описания',
        tags: file.tags ? (typeof file.tags === 'string' ? JSON.parse(file.tags) : file.tags) : [],
        category: file.category || 'Не указана',
        importance: typeof file.importance === 'string' ? parseInt(file.importance) : (file.importance || 0),
        keyPoints: file.key_points ? (typeof file.key_points === 'string' ? JSON.parse(file.key_points) : file.key_points) : [],
        technicalDetails: file.technical_details || '',
        dataPoints: file.data_points || ''
      }
    }

    res.status(200).json({
      success: true,
      file: parsedFile
    })
  } catch (error) {
    console.error('Error in analyzedFileGetById:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function analyzedFileDelete(req: ExpressRequest, res: Response) {
  const { id } = req.params
  const user_id = req.user_id

  if (!id) {
    return res.status(400).json({ message: 'File ID is required' })
  }

  try {
    const file = await db('analyzed-files-ai')
      .where({ id, user_id })
      .first()

    if (!file) {
      return res.status(404).json({ message: 'File not found or access denied' })
    }

    await db('analyzed-files-ai')
      .where({ id })
      .del()

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Error in analyzedFileDelete:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function publicAnalyzedFilesGet(req: ExpressRequest, res: Response) {
  const { 
    page = 1, 
    limit = 10
  } = req.query

  try {
    const query = db('analyzed-files-ai')
      .where({ is_public: true })
      .orderBy('importance', 'desc')
      .orderBy('created_at', 'desc')

    // Пагинация
    const offset = (Number(page) - 1) * Number(limit)
    const files = await query
      .limit(Number(limit))
      .offset(offset)
      .select('*')

    // Получаем общее количество записей для пагинации
    const [{ count }] = await db('analyzed-files-ai')
      .where({ is_public: true })
      .count('* as count')

    // Парсим JSON поля с безопасной обработкой и форматируем ответ
    const parsedFiles = files.map(file => ({
      id: file.id,
      fileName: file.file_name,
      fileSize: file.file_size,
      fileType: file.file_type,
      s3Url: file.s3_url,
      isLargeFile: file.is_large_file,
      totalLines: file.total_lines,
      isPublic: file.is_public,
      createdAt: file.created_at,
      updatedAt: file.updated_at,
      analysis: {
        summary: file.summary || 'Нет описания',
        tags: file.tags ? (typeof file.tags === 'string' ? JSON.parse(file.tags) : file.tags) : [],
        category: file.category || 'Не указана',
        importance: typeof file.importance === 'string' ? parseInt(file.importance) : (file.importance || 0),
        keyPoints: file.key_points ? (typeof file.key_points === 'string' ? JSON.parse(file.key_points) : file.key_points) : [],
        technicalDetails: file.technical_details || '',
        dataPoints: file.data_points || ''
      }
    }))

    res.status(200).json({
      success: true,
      files: parsedFiles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(count),
        totalPages: Math.ceil(Number(count) / Number(limit))
      }
    })
  } catch (error) {
    console.error('Error in publicAnalyzedFilesGet:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 