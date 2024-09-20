exports.up = async function (knex) {
  return knex.schema.createTable('my_message_to_people_modal', function (table) {
    table.increments('id').primary()
    table.string('user_id', 32).notNullable()
    table.boolean('is_undertake').notNullable()
    table.boolean('is_subscribed').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_message_to_people_modal')
}
