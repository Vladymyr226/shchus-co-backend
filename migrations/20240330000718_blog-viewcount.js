exports.up = async function (knex) {
  return knex.schema.createTable('blog_viewcount', function (table) {
    table.increments('id').primary()
    table.integer('post_id').notNullable()
    table.timestamp('viewed_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('blog_viewcount')
}
