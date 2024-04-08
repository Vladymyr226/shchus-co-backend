exports.up = async function (knex) {
  return knex.schema.createTable('featured_posts', function (table) {
    table.integer('user_id').notNullable()
    table.integer('post_id').notNullable()
    table.boolean('is_featured_post').notNullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('featured_posts')
}
