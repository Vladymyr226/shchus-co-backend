exports.up = function (knex) {
  return knex.schema.createTable('branding-ai', table => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('id').inTable('users-ai').onDelete('CASCADE')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('branding-ai')
}
