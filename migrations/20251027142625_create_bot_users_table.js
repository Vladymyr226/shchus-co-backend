exports.up = async function (knex) {
  return knex.schema.createTable('bot_users', function (table) {
    table.increments('id').primary()
    
    // Обязательные поля
    table.bigint('user_tg_id').notNullable().comment('Telegram ID пользователя')
    table.integer('user_id').notNullable().references('id').inTable('users-ai').onDelete('CASCADE').comment('Внешний ключ на таблицу users-ai')
    table.bigint('chat_id').notNullable().comment('ID чата для отправки сообщений')
    table.string('phone', 20).comment('Номер телефона пользователя')
    
    // Дополнительные поля
    table.string('username', 50).nullable().comment('Username пользователя в Telegram')
    table.string('first_name', 100).nullable().comment('Имя пользователя')
    table.string('last_name', 100).nullable().comment('Фамилия пользователя')
    table.timestamp('created_at').defaultTo(knex.fn.now()).comment('Дата создания записи')
    table.timestamp('updated_at').defaultTo(knex.fn.now()).comment('Дата последнего обновления')
    
    // Индексы для быстрого поиска
    table.index('user_tg_id', 'bot_users_user_tg_id_index')
    table.index('user_id', 'bot_users_user_id_index')
    table.index('phone', 'bot_users_phone_index')
    table.index('chat_id', 'bot_users_chat_id_index')
    
    // Уникальные ограничения
    table.unique('user_tg_id', 'bot_users_user_tg_id_unique')
    table.unique('chat_id', 'bot_users_chat_id_unique')
    table.unique('phone', 'bot_users_phone_unique')
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('bot_users')
}