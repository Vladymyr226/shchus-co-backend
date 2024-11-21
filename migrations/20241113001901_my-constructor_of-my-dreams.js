exports.up = async function (knex) {
  return knex.schema.createTable('my_constructor_of_my_dreams', function (table) {
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_constructor_of_my_dreams')
}
