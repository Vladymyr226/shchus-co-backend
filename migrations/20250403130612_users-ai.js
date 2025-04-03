exports.up = async function (knex) {
  return knex.schema.createTable('users-ai', function (table) {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('email', 40).unique().notNullable()
    table.string('password', 100).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('users-ai')
}
