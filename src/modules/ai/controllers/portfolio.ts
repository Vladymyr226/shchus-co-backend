import { ExpressRequest } from '../middlewares/user.auth'
import { Response } from 'express'
import db from '../../../db/knexKonfig'

const ALLOWED_PORTFOLIO_TABLES = [
  'idea-ai',
  'investor-ai',
  'unicorn-ai',
  'collaboration-ai',
  'recruiting-ai',
  'branding-ai',
  'marketing-ai',
  'prediction-ai',
  'supply-ai',
]

// Функция для преобразования JavaScript-массива в PostgreSQL-массив
const toPgArray = (arr: string[] | undefined | null) => {
  if (!arr || arr.length === 0) return null
  // Properly escape each item and handle special characters
  const escapedValues = arr.map(item => {
    // Replace single quotes with double quotes and escape special characters
    const escaped = item.replace(/'/g, "''")
    return `'${escaped}'`
  })
  return db.raw(`ARRAY[${escapedValues.join(',')}]::text[]`)
}

// Маппинг полей из req.body на поля базы данных
const FIELD_MAPPINGS: Array<{
  bodyKey: string
  dbKey: string
  transform?: (value: any) => any
}> = [
  { bodyKey: 'idea', dbKey: 'idea' },
  { bodyKey: 'text_content', dbKey: 'text_content' },
  { bodyKey: 'temperature', dbKey: 'temperature' },
  { bodyKey: 'develop_idea_content', dbKey: 'develop_idea_content', transform: toPgArray },
  { bodyKey: 'generated_images', dbKey: 'generated_images', transform: toPgArray },
  { bodyKey: 'model_mvp_content', dbKey: 'model_mvp_content', transform: toPgArray },
  { bodyKey: 'model_testing_content', dbKey: 'model_testing_content', transform: toPgArray },
  { bodyKey: 'model_team_content', dbKey: 'model_team_content', transform: toPgArray },
  { bodyKey: 'model_branding_content', dbKey: 'model_branding_content', transform: toPgArray },
  { bodyKey: 'model_documents_content', dbKey: 'model_documents_content', transform: toPgArray },
  { bodyKey: 'model_marketing_content', dbKey: 'model_marketing_content', transform: toPgArray },
  { bodyKey: 'model_fin_plan_content', dbKey: 'model_fin_plan_content', transform: toPgArray },
  { bodyKey: 'model_invest_content', dbKey: 'model_invest_content', transform: toPgArray },
  { bodyKey: 'model_ipo_content', dbKey: 'model_ipo_content', transform: toPgArray },
]

export async function myPortfolioPost(req: ExpressRequest, res: Response) {
  const { portfolio } = req.query as { portfolio?: string }
  const user_id = req.user_id

  // Проверка обязательных параметров
  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated' })
  }

  if (!portfolio) {
    return res.status(400).json({ message: 'Portfolio is required' })
  }

  if (!req.body.idea) {
    return res.status(400).json({ message: 'Idea is required' })
  }

  if (!ALLOWED_PORTFOLIO_TABLES.includes(portfolio)) {
    return res.status(400).json({ message: 'Invalid portfolio table' })
  }

  try {
    const result = await db.transaction(async trx => {
      // 1. Проверяем, существует ли портфель пользователя, или создаем новый
      let [portfolioRecord] = await trx(portfolio).where({ user_id }).select('id')

      if (!portfolioRecord) {
        ;[portfolioRecord] = await trx(portfolio).insert({ user_id }).returning('id')
      }

      // 2. Формируем объект для вставки в ideas-ai
      const insertData: { [key: string]: any } = {}

      // Собираем данные из req.body в объект для вставки
      FIELD_MAPPINGS.forEach(({ bodyKey, dbKey, transform }) => {
        const value = req.body[bodyKey]
        if (value !== undefined) {
          insertData[dbKey] = transform ? transform(value) : value
        }
      })

      // 3. Вставляем идею в таблицу ideas-ai
      const [ideaRecord] = await trx('ideas-ai').insert(insertData).returning('*')

      // 4. Создаем связь в portfolio_idea-ai
      await trx('portfolio_idea-ai').insert({
        [`${portfolio}_id`]: portfolioRecord.id,
        ['ideas-ai_id']: ideaRecord.id,
      })

      return { portfolioRecord, idea: ideaRecord }
    })

    // Успешный ответ
    res.status(201).json({
      success: true,
      portfolio: result.portfolioRecord,
      idea: result.idea,
    })
  } catch (error) {
    console.error(`Error in myPortfolioPost for ${portfolio}:`, error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function myPortfolioPut(req: ExpressRequest, res: Response) {
  const { portfolio } = req.query as {
    portfolio?: string
  }

  const user_id = req.user_id
  const { idea_id } = req.params as {
    idea_id?: string
  }

  // Проверка обязательных параметров
  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated' })
  }

  if (!portfolio) {
    return res.status(400).json({ message: 'Portfolio is required' })
  }

  if (!idea_id) {
    return res.status(400).json({ message: 'Idea ID is required' })
  }

  if (!ALLOWED_PORTFOLIO_TABLES.includes(portfolio)) {
    return res.status(400).json({ message: 'Invalid portfolio table' })
  }

  try {
    const result = await db.transaction(async trx => {
      // 1. Проверяем, существует ли портфель и принадлежит ли он пользователю
      const [portfolioRecord] = await trx(portfolio).where({ user_id }).select('id')

      if (!portfolioRecord) {
        throw new Error('Portfolio not found or does not belong to the user')
      }

      // 2. Проверяем, существует ли идея
      const [existingIdea] = await trx('ideas-ai')
        .where({ id: parseInt(idea_id) })
        .select('id')

      if (!existingIdea) {
        throw new Error('Idea not found')
      }

      // 3. Формируем объект для обновления только с переданными полями
      const updateData: { [key: string]: any } = {
        updated_at: db.fn.now(), // Всегда обновляем updated_at
      }

      // Собираем данные из req.body в объект для обновления
      FIELD_MAPPINGS.forEach(({ bodyKey, dbKey, transform }) => {
        const value = req.body[bodyKey]
        if (value !== undefined) {
          updateData[dbKey] = transform ? transform(value) : value
        }
      })

      // Если нет данных для обновления (кроме updated_at), возвращаем ошибку
      if (Object.keys(updateData).length === 1) {
        // Только updated_at
        throw new Error('No fields provided to update')
      }

      // 4. Обновляем идею в таблице ideas-ai только для переданных полей
      const [ideaRecord] = await trx('ideas-ai')
        .where({ id: parseInt(idea_id) })
        .update(updateData)
        .returning('*')

      // 5. Проверяем, существует ли связь в portfolio_idea-ai
      const [existingRelation] = await trx('portfolio_idea-ai')
        .where({
          [`${portfolio}_id`]: portfolioRecord.id,
          'ideas-ai_id': ideaRecord.id,
        })
        .select('*')

      // Если связь уже существует, обновляем её (если нужно), иначе создаем
      if (!existingRelation) {
        await trx('portfolio_idea-ai').insert({
          [`${portfolio}_id`]: portfolioRecord.id,
          ['ideas-ai_id']: ideaRecord.id,
        })
      }

      return { portfolioRecord, idea: ideaRecord }
    })

    // Успешный ответ
    res.status(200).json({
      success: true,
      portfolio: result.portfolioRecord,
      idea: result.idea,
    })
  } catch (error: any) {
    console.error(`Error in myPortfolioPut for ${portfolio}:`, error)
    return res.status(500).json({ message: error.message || 'Internal server error' })
  }
}

export async function myPortfolioGet(req: ExpressRequest, res: Response) {
  const { portfolio } = req.query as { portfolio?: string }
  const user_id = req.user_id

  // Проверка обязательных параметров
  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated' })
  }

  try {
    // Если portfolio указан, возвращаем данные только из этой таблицы
    if (portfolio) {
      // Проверка, что указанная таблица допустима
      if (!ALLOWED_PORTFOLIO_TABLES.includes(portfolio)) {
        return res.status(400).json({ message: 'Invalid portfolio table' })
      }

      // Получаем записи портфеля для пользователя
      const portfolioRecords = await db(portfolio).where({ user_id }).select('*')

      // Для каждой записи портфеля получаем связанные идеи
      const portfolioWithIdeas = await Promise.all(
        portfolioRecords.map(async record => {
          const ideas = await db('ideas-ai')
            .select('ideas-ai.*')
            .join('portfolio_idea-ai', 'ideas-ai.id', 'portfolio_idea-ai.ideas-ai_id')
            .where(`portfolio_idea-ai.${portfolio}_id`, record.id)

          return { ...record, ideas }
        })
      )

      // Успешный ответ
      return res.status(200).json({
        success: true,
        [portfolio]: portfolioWithIdeas,
      })
    }

    // Если portfolio не указан, возвращаем все портфели пользователя
    const allPortfolios = await Promise.all(
      ALLOWED_PORTFOLIO_TABLES.map(async portfolioTable => {
        // Получаем записи портфеля для пользователя
        const portfolioRecords = await db(portfolioTable).where({ user_id }).select('*')

        // Для каждой записи портфеля получаем связанные идеи
        const portfolioWithIdeas = await Promise.all(
          portfolioRecords.map(async record => {
            const ideas = await db('ideas-ai')
              .select('ideas-ai.*')
              .join('portfolio_idea-ai', 'ideas-ai.id', 'portfolio_idea-ai.ideas-ai_id')
              .where(`portfolio_idea-ai.${portfolioTable}_id`, record.id)

            return { ...record, ideas }
          })
        )

        return {
          portfolio: portfolioTable,
          data: portfolioWithIdeas,
        }
      })
    )

    // Успешный ответ
    res.status(200).json({
      success: true,
      portfolios: allPortfolios,
    })
  } catch (error) {
    console.error('Error in myPortfolioGet:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export async function myPortfolioDeleteIdea(req: ExpressRequest, res: Response) {
  const { portfolio } = req.query as { portfolio?: string }
  const user_id = req.user_id
  const { idea_id } = req.params as {
    idea_id?: string
  }

  // Проверка обязательных параметров
  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated' })
  }

  if (!portfolio) {
    return res.status(400).json({ message: 'Portfolio is required' })
  }

  if (!idea_id) {
    return res.status(400).json({ message: 'Idea ID is required' })
  }

  if (!ALLOWED_PORTFOLIO_TABLES.includes(portfolio)) {
    return res.status(400).json({ message: 'Invalid portfolio table' })
  }

  try {
    const result = await db.transaction(async trx => {
      // 1. Проверяем, существует ли идея
      const [ideaRecord] = await trx('ideas-ai')
        .where({ id: parseInt(idea_id) })
        .select('id')

      if (!ideaRecord) {
        throw new Error('Idea not found')
      }

      // 2. Проверяем, связана ли идея с портфелем пользователя
      const portfolioRelation = await trx('portfolio_idea-ai')
        .select('portfolio_idea-ai.*')
        .join(portfolio, `portfolio_idea-ai.${portfolio}_id`, `${portfolio}.id`)
        .where({
          [`portfolio_idea-ai.ideas-ai_id`]: parseInt(idea_id),
          [`${portfolio}.user_id`]: user_id,
        })
        .first()

      if (!portfolioRelation) {
        throw new Error('Idea is not associated with a portfolio belonging to the user')
      }

      // 3. Удаляем идею из ideas-ai
      // Связанные записи в portfolio_idea-ai удалятся автоматически благодаря onDelete: 'CASCADE'
      const deletedCount = await trx('ideas-ai')
        .where({ id: parseInt(idea_id) })
        .delete()

      if (deletedCount === 0) {
        throw new Error('Failed to delete the idea')
      }

      return { deletedIdeaId: parseInt(idea_id) }
    })

    // Успешный ответ
    res.status(200).json({
      success: true,
      message: 'Idea deleted successfully',
      deletedIdeaId: result.deletedIdeaId,
    })
  } catch (error: any) {
    console.error(`Error in myPortfolioDeleteIdea for ${portfolio}:`, error)
    return res.status(400).json({ message: error.message || 'Internal server error' })
  }
}
