exports.up = function (knex) {
  return knex.schema.alterTable('photos-ai', table => {
    table.integer('goal_id').references('id').inTable('goals-ai').onDelete('CASCADE')
    table.integer('task_id').references('id').inTable('tasks-ai').onDelete('CASCADE')
    table.integer('deadline_id').references('id').inTable('deadlines-ai').onDelete('CASCADE')
  })
}

exports.down = function (knex) {
  return knex.schema.alterTable('photos-ai', table => {
    table.dropColumn('goal_id')
    table.dropColumn('task_id')
    table.dropColumn('deadline_id')
  })
}
