exports.up = function (knex) {
  return knex.schema.createTable('portfolio_idea-ai', table => {
    table.increments('id').primary()
    table.integer('ideas-ai_id').notNullable().references('id').inTable('ideas-ai').onDelete('CASCADE')
    table.integer('idea-ai_id').nullable().references('id').inTable('idea-ai').onDelete('CASCADE')
    table.integer('investor-ai_id').nullable().references('id').inTable('investor-ai').onDelete('CASCADE')
    table.integer('unicorn-ai_id').nullable().references('id').inTable('unicorn-ai').onDelete('CASCADE')
    table.integer('collaboration-ai_id').nullable().references('id').inTable('collaboration-ai').onDelete('CASCADE')
    table.integer('recruiting-ai_id').nullable().references('id').inTable('recruiting-ai').onDelete('CASCADE')
    table.integer('branding-ai_id').nullable().references('id').inTable('branding-ai').onDelete('CASCADE')
    table.integer('marketing-ai_id').nullable().references('id').inTable('marketing-ai').onDelete('CASCADE')
    table.integer('prediction-ai_id').nullable().references('id').inTable('prediction-ai').onDelete('CASCADE')
    table.integer('supply-ai_id').nullable().references('id').inTable('supply-ai').onDelete('CASCADE')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('portfolio_idea-ai')
}
