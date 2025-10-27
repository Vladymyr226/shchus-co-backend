exports.up = async function (knex) {
  return knex.schema.createTable('kpi-tasks', function (table) {
    table.increments('id').primary()
    
    // Обязательные поля
    table.integer('user_id').notNullable().references('id').inTable('users-ai').onDelete('CASCADE').comment('Внешний ключ на таблицу users-ai')
    table.text('text').notNullable().comment('Текст задачи KPI')
    table.boolean('is_completed').defaultTo(false).notNullable().comment('Статус выполнения задачи')
    
    // Дополнительные поля
    table.timestamp('deadline').nullable().comment('Дедлайн задачи')
    
    // Служебные поля
    table.timestamp('completed_at').nullable().comment('Время завершения задачи')
    table.timestamp('created_at').defaultTo(knex.fn.now()).comment('Дата создания записи')
    table.timestamp('updated_at').defaultTo(knex.fn.now()).comment('Дата последнего обновления')
    
    // Индексы для быстрого поиска
    table.index('user_id', 'kpi_tasks_user_id_index')
    table.index('is_completed', 'kpi_tasks_is_completed_index')
    table.index('deadline', 'kpi_tasks_deadline_index')
    table.index('created_at', 'kpi_tasks_created_at_index')
    
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('kpi-tasks')
}