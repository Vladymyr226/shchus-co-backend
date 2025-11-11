exports.up = async function (knex) {
  return knex.schema.createTable('my_about_bureau', function (table) {
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_about_bureau')
}
