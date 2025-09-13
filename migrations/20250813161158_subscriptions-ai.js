exports.up = async function (knex) {
  return knex.schema.createTable('subscriptions_ai', function (table) {
    table.increments('id').primary()
    table.integer('user_id').notNullable()
    table.string('order_time', 32).notNullable()
    table.string('order_id', 32).notNullable()
    table.text('description').notNullable()
    table.integer('price').notNullable()
    table.string('order_status', 32).notNullable()
    table.text('payment').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('subscriptions_ai')
}
