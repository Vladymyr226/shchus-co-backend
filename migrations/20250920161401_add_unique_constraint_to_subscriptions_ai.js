/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('subscriptions_ai', function(table) {
    table.unique(['order_id'], 'unique_order_per_user')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('subscriptions_ai', function(table) {
    table.dropUnique(['order_id'], 'unique_order_per_user')
  })
};
