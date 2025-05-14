exports.up = async function (knex) {
  return knex.schema.alterTable('users-ai', function (table) {
    table.string('password', 100).nullable().alter()
    table.string('google_id').unique().nullable()
    table.string('avatar').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.alterTable('users-ai', function (table) {
    table.string('password', 100).notNullable().alter()
    table.dropColumn('google_id')
    table.dropColumn('avatar')
  })
}
