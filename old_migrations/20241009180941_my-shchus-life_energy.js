exports.up = async function (knex) {
  return knex.schema.createTable('my_shchus_life_energy', function (table) {
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_shchus_life_energy')
}
