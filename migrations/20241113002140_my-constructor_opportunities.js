exports.up = async function (knex) {
  return knex.schema.createTable('my_constructor_opportunities', function (table) {
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_constructor_opportunities')
}
