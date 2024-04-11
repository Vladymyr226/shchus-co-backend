exports.up = async function (knex) {
  return knex.schema.createTable('dbs_500_club_idea_items', function (table) {
    table.increments('id').primary()
    table.integer('user_id').references('users.id').notNullable()
    table.integer('dbs_500_club_idea_id').references('dbs_500_club_idea.id').notNullable()
    table.text('lorem_0').notNullable()
    table.text('lorem_1').notNullable()
    table.text('lorem_2').notNullable()
    table.text('lorem_3').notNullable()
    table.text('lorem_4').notNullable()
    table.text('lorem_5').notNullable()
    table.text('img_file0').notNullable()
    table.text('img_file2').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('dbs_500_club_idea_items')
}
