exports.up = async function (knex) {
  return knex.schema.createTable('my_message_to_investors', function (table) {
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('my_message_to_investors')
}
