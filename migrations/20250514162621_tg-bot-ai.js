exports.up = async function (knex) {
  await knex.schema.createTable('tg-bot-ai', table => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('id').inTable('users-ai').onDelete('CASCADE')
    table.bigint('user_tg_id').nullable()
    table.bigint('chat_id').nullable()
    table.string('phone_number', 15).nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('tg-bot-ai')
}
