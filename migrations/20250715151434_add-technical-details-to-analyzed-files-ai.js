/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('analyzed-files-ai', (table) => {
    table.text('technical_details').nullable()
    table.text('data_points').nullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('analyzed-files-ai', (table) => {
    table.dropColumn('technical_details')
    table.dropColumn('data_points')
  })
}
