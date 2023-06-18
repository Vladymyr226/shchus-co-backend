exports.up = async function (knex) {
  return knex.schema.createTable('subscriptions', function (table) {
    table.increments('id').primary()
    table.integer('user_id').references('users.id').notNullable()
    table.string('order_status', 32).notNullable()
    table.text('payment').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('subscriptions')
}
