exports.up = async function (knex) {
  return knex.schema.createTable('cast_ind_transf_voltage', function (table) {
    table.increments('id').primary()
    table.integer('user_id').references('users.id').notNullable()
    table.text('title_section').notNullable()
    table.string('title_product').notNullable()
    table.string('country_manufacturer').notNullable()
    table.text('descr_product').notNullable()
    table.text('about_company').notNullable()
    table.text('core_product').notNullable()
    table.text('photo_product').notNullable()
    table.text('video_product')
    table.text('pdf_product')
    table.text('public_archive_product')
    table.text('private_archive_product')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('cast_ind_transf_voltage')
}
