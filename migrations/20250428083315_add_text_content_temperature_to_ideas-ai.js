exports.up = function (knex) {
  return knex.schema.alterTable('ideas-ai', table => {
    table.text('text_content').nullable()
    table.float('temperature').nullable().defaultTo(0)
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('ideas-ai', table => {
    table.dropColumn('text_content')
    table.dropColumn('temperature')
  })
}
