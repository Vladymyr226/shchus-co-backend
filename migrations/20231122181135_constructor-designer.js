exports.up = async function (knex) {
  return knex.schema.createTable('constructor_designer', function (table) {
    table.increments('id').primary()
    table.text('lorem_0').notNullable()
    table.text('lorem_1').notNullable()
    table.text('lorem_2').notNullable()
    table.text('lorem_3').notNullable()
    table.text('lorem_4').notNullable()
    table.text('selected_option').notNullable()
    table.text('lorem_5').notNullable()
    table.text('lorem_6').notNullable()
    table.text('lorem_7').notNullable()
    table.text('lorem_8').notNullable()

    table.text('video_file0').notNullable()
    table.text('img_file0').notNullable()
    table.text('img_file2').notNullable()
    table.text('video_file1').notNullable()
    table.text('archive_file0').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('constructor_designer')
}
