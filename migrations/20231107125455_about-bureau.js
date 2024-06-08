exports.up = async function (knex) {
  return knex.schema.createTable('about_bureau', function (table) {
    table.increments('id').primary()
    table.json('data').nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('about_bureau')
}
