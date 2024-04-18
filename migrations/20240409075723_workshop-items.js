exports.up = async function (knex) {
  return knex.schema.createTable('workshop_items', function (table) {
    table.increments('id').primary()
    table.integer('user_id').references('users.id').notNullable()
    table.integer('workshop_id').references('workshop.id').notNullable()
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
  return knex.schema.dropTable('workshop_items')
}
