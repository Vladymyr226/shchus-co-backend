exports.up = async function (knex) {
  return knex.schema.createTable('my_industrial_hub_materials', function (table) {
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_industrial_hub_materials')
}
