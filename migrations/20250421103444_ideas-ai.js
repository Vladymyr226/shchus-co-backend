exports.up = async function (knex) {
  await knex.schema.createTable('ideas-ai', (table) => {
    table.increments('id').primary();
    table.text('idea').notNullable();
    table.specificType('develop_idea_content', 'text[]').nullable();
    table.specificType('generated_images', 'text[]').nullable();
    table.specificType('model_mvp_content', 'text[]').nullable();
    table.specificType('model_testing_content', 'text[]').nullable();
    table.specificType('model_team_content', 'text[]').nullable();
    table.specificType('model_branding_content', 'text[]').nullable();
    table.specificType('model_documents_content', 'text[]').nullable();
    table.specificType('model_marketing_content', 'text[]').nullable();
    table.specificType('model_fin_plan_content', 'text[]').nullable();
    table.specificType('model_invest_content', 'text[]').nullable();
    table.specificType('model_ipo_content', 'text[]').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('ideas-ai');
};
