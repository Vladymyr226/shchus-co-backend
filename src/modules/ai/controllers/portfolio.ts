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
];


// Функция для преобразования JavaScript-массива в PostgreSQL-массив
const toPgArray = (arr: string[] | undefined | null) => {
  if (!arr || arr.length === 0) return null;
  return db.raw(`ARRAY[${arr.map((item) => `'${item}'`).join(',')}]::text[]`);
};

export async function myPortfolioPost(req: ExpressRequest, res: Response) {
  const { portfolio } = req.query as { portfolio?: string };
  const {
    idea,
    develop_idea_content,
    generated_images,
    model_mvp_content,
    model_testing_content,
    model_team_content,
    model_branding_content,
    model_documents_content,
    model_marketing_content,
    model_fin_plan_content,
    model_invest_content,
    model_ipo_content,
  } = req.body;

  const user_id = req.user_id

  if (!portfolio) {
    return res.status(400).json({ message: 'Portfolio is required' })
  }

  if (!idea) {
    return res.status(400).json({ message: 'Idea is required' })
  }

  if (!ALLOWED_PORTFOLIO_TABLES.includes(portfolio)) {
    return res.status(400).json({ message: 'Invalid portfolio table' });
  }

  try {
    const result = await db.transaction(async (trx) => {
      let [portfolioRecord] = await trx(portfolio)
        .where({ user_id })
        .select('id');

      if (!portfolioRecord) {
        [portfolioRecord] = await trx(portfolio)
          .insert({ user_id })
          .returning('id');
      }

       const [ideaRecord] = await trx('ideas-ai')
        .insert({
          idea,
          develop_idea_content: toPgArray(develop_idea_content) || null,
          generated_images: toPgArray(generated_images) || null,
          model_mvp_content: toPgArray(model_mvp_content) || null,
          model_testing_content: toPgArray(model_testing_content) || null,
          model_team_content: toPgArray(model_team_content) || null,
          model_branding_content: toPgArray(model_branding_content) || null,
          model_documents_content: toPgArray(model_documents_content) || null,
          model_marketing_content: toPgArray(model_marketing_content) || null,
          model_fin_plan_content: toPgArray(model_fin_plan_content) || null,
          model_invest_content: toPgArray(model_invest_content) || null,
          model_ipo_content: toPgArray(model_ipo_content) || null,
        })
        .returning('*');

      await trx('portfolio_idea-ai').insert({
        [`${portfolio}_id`]: portfolioRecord.id,
        ['ideas-ai_id']: ideaRecord.id,
      });

      return { portfolioRecord, idea: ideaRecord };
    });

    res.status(201).json({
      success: true,
      portfolio: result.portfolioRecord,
      idea: result.idea,
    });
  } catch (error) {
    console.error(`Error in myPortfolioPost for ${portfolio}:`, error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function myPortfolioPut(req: ExpressRequest, res: Response) {
  const { portfolio } = req.query as {
    portfolio?: string;
  };
  const {
    idea,
    develop_idea_content,
    generated_images,
    model_mvp_content,
    model_testing_content,
    model_team_content,
    model_branding_content,
    model_documents_content,
    model_marketing_content,
    model_fin_plan_content,
    model_invest_content,
    model_ipo_content,
  } = req.body;

  const user_id = req.user_id;
  const {idea_id} = req.params as {
    idea_id?: string;
  };

  // Проверка обязательных параметров
  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!portfolio) {
    return res.status(400).json({ message: 'Portfolio is required' });
  }

  if (!idea_id) {
    return res.status(400).json({ message: 'Idea ID is required' });
  }

  if (!ALLOWED_PORTFOLIO_TABLES.includes(portfolio)) {
    return res.status(400).json({ message: 'Invalid portfolio table' });
  }

  try {
    const result = await db.transaction(async (trx) => {
      // 1. Проверяем, существует ли портфель и принадлежит ли он пользователю
      const [portfolioRecord] = await trx(portfolio)
        .where({ user_id })
        .select('id');

      if (!portfolioRecord) {
        throw new Error('Portfolio not found or does not belong to the user');
      }

      // 2. Проверяем, существует ли идея
      const [existingIdea] = await trx('ideas-ai')
        .where({ id: parseInt(idea_id) })
        .select('id');

      if (!existingIdea) {
        throw new Error('Idea not found');
      }

      // 3. Обновляем идею в таблице ideas-ai
      const [ideaRecord] = await trx('ideas-ai')
        .where({ id: parseInt(idea_id) })
        .update({
          idea,
          develop_idea_content: toPgArray(develop_idea_content) || null,
          generated_images: toPgArray(generated_images) || null,
          model_mvp_content: toPgArray(model_mvp_content) || null,
          model_testing_content: toPgArray(model_testing_content) || null,
          model_team_content: toPgArray(model_team_content) || null,
          model_branding_content: toPgArray(model_branding_content) || null,
          model_documents_content: toPgArray(model_documents_content) || null,
          model_marketing_content: toPgArray(model_marketing_content) || null,
          model_fin_plan_content: toPgArray(model_fin_plan_content) || null,
          model_invest_content: toPgArray(model_invest_content) || null,
          model_ipo_content: toPgArray(model_ipo_content) || null,
          updated_at: db.fn.now(),
        })
        .returning('*');

      // 4. Проверяем, существует ли связь в portfolio_idea-ai
      const [existingRelation] = await trx('portfolio_idea-ai')
        .where({
          [`${portfolio}_id`]: portfolioRecord.id,
          'ideas-ai_id': ideaRecord.id,
        })
        .select('*');

      // Если связь уже существует, обновляем её (если нужно), иначе создаем
      if (!existingRelation) {
        await trx('portfolio_idea-ai').insert({
          [`${portfolio}_id`]: portfolioRecord.id,
          ['ideas-ai_id']: ideaRecord.id,
        });
      }

      return { portfolioRecord, idea: ideaRecord };
    });

    // Успешный ответ
    res.status(200).json({
      success: true,
      portfolio: result.portfolioRecord,
      idea: result.idea,
    });
  } catch (error: any) {
    console.error(`Error in myPortfolioPut for ${portfolio}:`, error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}

export async function myPortfolioGet(req: ExpressRequest, res: Response) {
  const { portfolio } = req.query as { portfolio?: string };
  const user_id = req.user_id;

  // Проверка обязательных параметров
  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Если portfolio указан, возвращаем данные только из этой таблицы
    if (portfolio) {
      // Проверка, что указанная таблица допустима
      if (!ALLOWED_PORTFOLIO_TABLES.includes(portfolio)) {
        return res.status(400).json({ message: 'Invalid portfolio table' });
      }

      // Получаем записи портфеля для пользователя
      const portfolioRecords = await db(portfolio)
        .where({ user_id })
        .select('*');

      // Для каждой записи портфеля получаем связанные идеи
      const portfolioWithIdeas = await Promise.all(
        portfolioRecords.map(async (record) => {
          const ideas = await db('ideas-ai')
            .select('ideas-ai.*')
            .join('portfolio_idea-ai', 'ideas-ai.id', 'portfolio_idea-ai.ideas-ai_id')
            .where(`portfolio_idea-ai.${portfolio}_id`, record.id);

          return { ...record, ideas };
        })
      );

      // Успешный ответ
      return res.status(200).json({
        success: true,
        [portfolio]: portfolioWithIdeas,
      });
    }

    // Если portfolio не указан, возвращаем все портфели пользователя
    const allPortfolios = await Promise.all(
      ALLOWED_PORTFOLIO_TABLES.map(async (portfolioTable) => {
        // Получаем записи портфеля для пользователя
        const portfolioRecords = await db(portfolioTable)
          .where({ user_id })
          .select('*');

        // Для каждой записи портфеля получаем связанные идеи
        const portfolioWithIdeas = await Promise.all(
          portfolioRecords.map(async (record) => {
            const ideas = await db('ideas-ai')
              .select('ideas-ai.*')
              .join('portfolio_idea-ai', 'ideas-ai.id', 'portfolio_idea-ai.ideas-ai_id')
              .where(`portfolio_idea-ai.${portfolioTable}_id`, record.id);

            return { ...record, ideas };
          })
        );

        return {
          portfolio: portfolioTable,
          data: portfolioWithIdeas,
        };
      })
    );

    // Успешный ответ
    res.status(200).json({
      success: true,
      portfolios: allPortfolios,
    });
  } catch (error) {
    console.error('Error in myPortfolioGet:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function myPortfolioDeleteIdea(req: ExpressRequest, res: Response) {
  const { portfolio } = req.query as { portfolio?: string };
  const user_id = req.user_id;
  const {idea_id} = req.params as {
    idea_id?: string;
  };

  // Проверка обязательных параметров
  if (!user_id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!portfolio) {
    return res.status(400).json({ message: 'Portfolio is required' });
  }

  if (!idea_id) {
    return res.status(400).json({ message: 'Idea ID is required' });
  }

  if (!ALLOWED_PORTFOLIO_TABLES.includes(portfolio)) {
    return res.status(400).json({ message: 'Invalid portfolio table' });
  }

  try {
    const result = await db.transaction(async (trx) => {
      // 1. Проверяем, существует ли идея
      const [ideaRecord] = await trx('ideas-ai')
        .where({ id: parseInt(idea_id) })
        .select('id');

      if (!ideaRecord) {
        throw new Error('Idea not found');
      }

      // 2. Проверяем, связана ли идея с портфелем пользователя
      const portfolioRelation = await trx('portfolio_idea-ai')
        .select('portfolio_idea-ai.*')
        .join(portfolio, `portfolio_idea-ai.${portfolio}_id`, `${portfolio}.id`)
        .where({
          [`portfolio_idea-ai.ideas-ai_id`]: parseInt(idea_id),
          [`${portfolio}.user_id`]: user_id,
        })
        .first();

      if (!portfolioRelation) {
        throw new Error('Idea is not associated with a portfolio belonging to the user');
      }

      // 3. Удаляем идею из ideas-ai
      // Связанные записи в portfolio_idea-ai удалятся автоматически благодаря onDelete: 'CASCADE'
      const deletedCount = await trx('ideas-ai')
        .where({ id: parseInt(idea_id) })
        .delete();

      if (deletedCount === 0) {
        throw new Error('Failed to delete the idea');
      }

      return { deletedIdeaId: parseInt(idea_id) };
    });

    // Успешный ответ
    res.status(200).json({
      success: true,
      message: 'Idea deleted successfully',
      deletedIdeaId: result.deletedIdeaId,
    });
  } catch (error: any) {
    console.error(`Error in myPortfolioDeleteIdea for ${portfolio}:`, error);
    return res.status(400).json({ message: error.message || 'Internal server error' });
  }
}
