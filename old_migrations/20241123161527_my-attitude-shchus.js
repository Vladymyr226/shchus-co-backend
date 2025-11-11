exports.up = async function (knex) {
  return knex.schema.createTable('my_attitude_shchus', function (table) {
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_attitude_shchus')
}
