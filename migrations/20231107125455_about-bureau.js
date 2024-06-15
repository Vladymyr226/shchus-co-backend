exports.up = async function (knex) {
  return knex.schema.createTable('about_bureau', function (table) {
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('about_bureau')
}
