/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('public_chats_ai', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable() // Назва чату (Маркетинг, Рекрутинг, Брендинг)
      table.string('slug').unique().notNullable() // Унікальний ідентифікатор (marketing, recruiting, branding)
      table.text('description').nullable() // Опис чату
      table.string('icon').nullable() // Іконка чату
      table.string('color', 7).defaultTo('#3B82F6') // Колір чату (hex)
      table.boolean('is_active').defaultTo(true) // Чи активний чат
      table.integer('max_members').defaultTo(1000) // Максимальна кількість учасників
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
      
      // Індекси
      table.index('slug')
      table.index('is_active')
    })
    .createTable('public_chat_messages_ai', (table) => {
      table.increments('id').primary()
      table.integer('public_chat_id').unsigned().notNullable()
      table.integer('sender_id').unsigned().notNullable()
      table.text('content').notNullable()
      table.boolean('is_pinned').defaultTo(false) // Закріплене повідомлення
      table.integer('reply_to_id').unsigned().nullable() // Відповідь на повідомлення
      table.timestamp('created_at').defaultTo(knex.fn.now())
      
      // Зовнішні ключі
      table.foreign('public_chat_id').references('public_chats_ai.id').onDelete('CASCADE')
      table.foreign('sender_id').references('users-ai.id').onDelete('CASCADE')
      table.foreign('reply_to_id').references('public_chat_messages_ai.id').onDelete('SET NULL')
      
      // Індекси
      table.index('public_chat_id')
      table.index('sender_id')
      table.index('created_at')
      table.index('is_pinned')
    })
        .then(() => {
          // Створюємо загальні чати
          return knex('public_chats_ai').insert([
            {
              name: 'Маркетинг',
              slug: 'marketing',
              description: 'Обговорення маркетингових стратегій, кампаній та трендів',
              icon: '📈',
              color: '#10B981'
            },
            {
              name: 'Рекрутинг',
              slug: 'recruiting',
              description: 'Пошук та обговорення кандидатів, вакансій та HR процесів',
              icon: '👥',
              color: '#8B5CF6'
            },
            {
              name: 'Брендинг',
              slug: 'branding',
              description: 'Розробка бренду, дизайну та корпоративної ідентичності',
              icon: '🎨',
              color: '#F59E0B'
            },
            {
              name: 'Колаборації',
              slug: 'collaborations',
              description: 'Пошук партнерів, спільних проектів та бізнес-співпраці',
              icon: '🤝',
              color: '#06B6D4'
            },
            {
              name: 'Єдинороги',
              slug: 'unicorns',
              description: 'Обговорення стартапів-єдинорогів, масштабування та зростання',
              icon: '🦄',
              color: '#EC4899'
            },
            {
              name: 'Інвестори',
              slug: 'investors',
              description: 'Пошук інвестицій, pitch-презентації та фінансування',
              icon: '💰',
              color: '#84CC16'
            },
            {
              name: 'КБЩ Нетворкінг',
              slug: 'kbch-networking',
              description: 'Нетворкінг, знайомства та загальна розмовна в КБЩ',
              icon: '🌐',
              color: '#6366F1'
            }
          ])
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('public_chat_messages_ai')
    .dropTableIfExists('public_chats_ai');
};
