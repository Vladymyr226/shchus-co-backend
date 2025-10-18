/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('chats_ai', (table) => {
      table.increments('id').primary()
      table.integer('user1_id').unsigned().notNullable()
      table.integer('user2_id').unsigned().notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
      
      // Індекси для швидкого пошуку
      table.index(['user1_id', 'user2_id'])
      table.unique(['user1_id', 'user2_id'])
    })
    .createTable('chat_messages_ai', (table) => {
      table.increments('id').primary()
      table.integer('chat_id').unsigned().notNullable()
      table.integer('sender_id').unsigned().notNullable()
      table.integer('receiver_id').unsigned().notNullable()
      table.text('content').notNullable()
      table.boolean('is_read').defaultTo(false)
      table.timestamp('created_at').defaultTo(knex.fn.now())
      
      // Зовнішні ключі
      table.foreign('chat_id').references('chats_ai.id').onDelete('CASCADE')
      
      // Індекси
      table.index('chat_id')
      table.index('sender_id')
      table.index('receiver_id')
      table.index('is_read')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('chat_messages_ai')
    .dropTableIfExists('chats_ai')
};
