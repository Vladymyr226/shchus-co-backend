exports.up = function (knex) {
  return knex.schema.createTable('tasks-ai', table => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('id').inTable('users-ai').onDelete('CASCADE')
    table.text('transcribe_text').nullable()
    table.boolean('is_completed').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('tasks-ai')
}
