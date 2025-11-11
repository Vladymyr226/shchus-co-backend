exports.up = async function (knex) {
  return knex.schema.createTable('my_about_shchus', function (table) {
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_about_shchus')
}
