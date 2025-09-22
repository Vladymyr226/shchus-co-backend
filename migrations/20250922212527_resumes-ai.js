exports.up = async function (knex) {
  return knex.schema.createTable('resumes_ai', function (table) {
    table.increments('id').primary()
    table.string('templateId', 50).notNullable()
    table.json('resumeData').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('resumes_ai')
}
