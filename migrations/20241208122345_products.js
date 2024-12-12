exports.up = async function (knex) {
  return knex.schema.createTable('products', function (table) {
    table.increments('id').primary()
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.integer('price').notNullable()
    table
      .text('type')
      .notNullable()
      .checkIn([
        'MarketplaceProjects',
        'MarketplaceMaterials',
        'LibraryBooks',
        'LibraryMagazines',
        'LibraryPublications',
      ])
    table.json('data').nullable()
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTable('products')
}
