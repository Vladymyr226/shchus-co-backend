exports.up = async function (knex) {
  return knex.schema.createTable('my_archive_hub', function (table) {
    table.increments('id').primary()
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_archive_hub')
}
