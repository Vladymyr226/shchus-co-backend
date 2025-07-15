/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('analyzed-files-ai', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNullable().references('id').inTable('users-ai').onDelete('CASCADE')
    table.string('file_name').notNullable()
    table.integer('file_size').notNullable()
    table.string('file_type').notNullable()
    table.text('s3_url').notNullable()
    table.text('summary').notNullable()
    table.json('tags').notNullable()
    table.string('category').notNullable()
    table.string('importance').notNullable()
    table.json('key_points').notNullable()
    table.boolean('is_large_file').defaultTo(false)
    table.integer('total_lines').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
    // Индексы для оптимизации запросов
    table.index(['user_id'])
    table.index(['file_type'])
    table.index(['category'])
    table.index(['importance'])
    table.index(['created_at'])
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('analyzed-files-ai')
}
