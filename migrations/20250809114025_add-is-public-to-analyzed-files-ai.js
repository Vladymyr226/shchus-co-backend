/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('analyzed-files-ai', (table) => {
    table.boolean('is_public').defaultTo(false).notNullable()
    
    // Добавляем индекс для оптимизации запросов по публичным файлам
    table.index(['is_public'])
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('analyzed-files-ai', (table) => {
    table.dropIndex(['is_public'])
    table.dropColumn('is_public')
  })
}