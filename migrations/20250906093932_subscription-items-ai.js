exports.up = async function (knex) {
  return knex.schema.createTable('subscription-items-ai', function (table) {
    table.increments('id').primary()
    table.string('description', 255).notNullable()
    table.string('unit', 100).notNullable()
    table.decimal('unit_cost', 10, 3).notNullable()
    table.integer('package').notNullable()
    table.decimal('price', 10, 3).notNullable()
    table.string('dimension', 50).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('subscription-items-ai')
}