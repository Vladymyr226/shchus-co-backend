import { Response } from 'express'
import db from '../../../db/knexKonfig'
import { ExpressRequest } from '../middlewares/user.auth'

// Функция транслитерации русских символов в английские
function transliterate(text: string): string {
  const translitMap: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  }
  
  return text.split('').map(char => translitMap[char] || char).join('')
}

// Функция обратной транслитерации (английские в русские)
function reverseTransliterate(text: string): string {
  const reverseTranslitMap: { [key: string]: string } = {
    'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'yo': 'ё',
    'zh': 'ж', 'z': 'з', 'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м',
    'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
    'f': 'ф', 'h': 'х', 'ts': 'ц', 'ch': 'ч', 'sh': 'ш', 'sch': 'щ',
    'yu': 'ю', 'ya': 'я',
    'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'E': 'Е', 'Yo': 'Ё',
    'Zh': 'Ж', 'Z': 'З', 'I': 'И', 'Y': 'Й', 'K': 'К', 'L': 'Л', 'M': 'М',
    'N': 'Н', 'O': 'О', 'P': 'П', 'R': 'Р', 'S': 'С', 'T': 'Т', 'U': 'У',
    'F': 'Ф', 'H': 'Х', 'Ts': 'Ц', 'Ch': 'Ч', 'Sh': 'Ш', 'Sch': 'Щ',
    'Yu': 'Ю', 'Ya': 'Я'
  }
  
  let result = text
  
  // Сначала заменяем многосимвольные комбинации (сначала заглавные, потом строчные)
  for (const [eng, rus] of Object.entries(reverseTranslitMap)) {
    if (eng.length > 1) {
      result = result.replace(new RegExp(eng, 'g'), rus)
    }
  }
  
  // Затем одиночные символы (сначала заглавные, потом строчные)
  for (const [eng, rus] of Object.entries(reverseTranslitMap)) {
    if (eng.length === 1) {
      result = result.replace(new RegExp(eng, 'g'), rus)
    }
  }
  
  return result
}

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
    limit = 10,
    search,
    category
  } = req.query

  try {
    let query = db('analyzed-files-ai')
      .where({ user_id, is_public: false })

    // Фильтр по категории
    if (category && typeof category === 'string' && category.trim()) {
      const categoryTerm = category.trim()
      const transliteratedCategory = transliterate(categoryTerm)
      const reverseTransliteratedCategory = reverseTransliterate(categoryTerm)
      
      query = query.where(function() {
        this.whereILike('category', `%${categoryTerm}%`)
          .orWhereILike('category', `%${transliteratedCategory}%`)
          .orWhereILike('category', `%${reverseTransliteratedCategory}%`)
      })
    }

    // Поиск по названию файла, тегам, категории или описанию
    if (search && typeof search === 'string' && search.trim()) {
      const searchTerm = search.trim()
      const transliteratedTerm = transliterate(searchTerm)
      const reverseTransliteratedTerm = reverseTransliterate(searchTerm)
      
      query = query.where(function() {
        this.whereILike('file_name', `%${searchTerm}%`)
          .orWhereILike('category', `%${searchTerm}%`)
          .orWhereILike('summary', `%${searchTerm}%`)
          .orWhereRaw(`tags::text ILIKE ?`, [`%${searchTerm}%`])
          // Поиск по транслитерации (русские -> английские)
          .orWhereILike('file_name', `%${transliteratedTerm}%`)
          .orWhereILike('category', `%${transliteratedTerm}%`)
          .orWhereILike('summary', `%${transliteratedTerm}%`)
          .orWhereRaw(`tags::text ILIKE ?`, [`%${transliteratedTerm}%`])
          // Поиск по обратной транслитерации (английские -> русские)
          .orWhereILike('file_name', `%${reverseTransliteratedTerm}%`)
          .orWhereILike('category', `%${reverseTransliteratedTerm}%`)
          .orWhereILike('summary', `%${reverseTransliteratedTerm}%`)
          .orWhereRaw(`tags::text ILIKE ?`, [`%${reverseTransliteratedTerm}%`])
      })
    }

    query = query.orderBy('importance', 'desc')
      .orderBy('created_at', 'desc')

    // Пагинация
    const offset = (Number(page) - 1) * Number(limit)
    const files = await query
      .limit(Number(limit))
      .offset(offset)
      .select('*')

    // Получаем общее количество записей для пагинации с учетом поиска
    let countQuery = db('analyzed-files-ai')
      .where({ user_id, is_public: false })
    
    if (search && typeof search === 'string' && search.trim()) {
      const searchTerm = search.trim()
      countQuery = countQuery.where(function() {
        this.whereILike('file_name', `%${searchTerm}%`)
          .orWhereILike('category', `%${searchTerm}%`)
          .orWhereILike('summary', `%${searchTerm}%`)
          .orWhereRaw(`tags::text ILIKE ?`, [`%${searchTerm}%`])
      })
    }
    
    const [{ count }] = await countQuery.count('* as count')

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
    limit = 10,
    search,
    category
  } = req.query

  try {
    let query = db('analyzed-files-ai')
      .where({ is_public: true })

    // Фильтр по категории
    if (category && typeof category === 'string' && category.trim()) {
      const categoryTerm = category.trim()
      const transliteratedCategory = transliterate(categoryTerm)
      const reverseTransliteratedCategory = reverseTransliterate(categoryTerm)
      
      query = query.where(function() {
        this.whereILike('category', `%${categoryTerm}%`)
          .orWhereILike('category', `%${transliteratedCategory}%`)
          .orWhereILike('category', `%${reverseTransliteratedCategory}%`)
      })
    }

    // Поиск по названию файла, тегам, категории или описанию
    if (search && typeof search === 'string' && search.trim()) {
      const searchTerm = search.trim()
      const transliteratedTerm = transliterate(searchTerm)
      const reverseTransliteratedTerm = reverseTransliterate(searchTerm)
      
      query = query.where(function() {
        this.whereILike('file_name', `%${searchTerm}%`)
          .orWhereILike('category', `%${searchTerm}%`)
          .orWhereILike('summary', `%${searchTerm}%`)
          .orWhereRaw(`tags::text ILIKE ?`, [`%${searchTerm}%`])
          // Поиск по транслитерации (русские -> английские)
          .orWhereILike('file_name', `%${transliteratedTerm}%`)
          .orWhereILike('category', `%${transliteratedTerm}%`)
          .orWhereILike('summary', `%${transliteratedTerm}%`)
          .orWhereRaw(`tags::text ILIKE ?`, [`%${transliteratedTerm}%`])
          // Поиск по обратной транслитерации (английские -> русские)
          .orWhereILike('file_name', `%${reverseTransliteratedTerm}%`)
          .orWhereILike('category', `%${reverseTransliteratedTerm}%`)
          .orWhereILike('summary', `%${reverseTransliteratedTerm}%`)
          .orWhereRaw(`tags::text ILIKE ?`, [`%${reverseTransliteratedTerm}%`])
      })
    }

    query = query.orderBy('importance', 'desc')
      .orderBy('created_at', 'desc')

    // Пагинация
    const offset = (Number(page) - 1) * Number(limit)
    const files = await query
      .limit(Number(limit))
      .offset(offset)
      .select('*')

    // Получаем общее количество записей для пагинации с учетом поиска
    let countQuery = db('analyzed-files-ai')
      .where({ is_public: true })
    
    if (search && typeof search === 'string' && search.trim()) {
      const searchTerm = search.trim()
      countQuery = countQuery.where(function() {
        this.whereILike('file_name', `%${searchTerm}%`)
          .orWhereILike('category', `%${searchTerm}%`)
          .orWhereILike('summary', `%${searchTerm}%`)
          .orWhereRaw(`tags::text ILIKE ?`, [`%${searchTerm}%`])
      })
    }
    
    const [{ count }] = await countQuery.count('* as count')

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