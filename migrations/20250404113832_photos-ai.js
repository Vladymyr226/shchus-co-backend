exports.up = function (knex) {
  return knex.schema.createTable('photos-ai', table => {
    table.increments('id').primary()
    table.integer('note_id').references('id').inTable('notes-ai').onDelete('CASCADE')
    table.text('url').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('photos-ai')
}
