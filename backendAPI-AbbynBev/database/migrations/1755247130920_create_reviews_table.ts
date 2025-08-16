import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE')
      table.integer('product_id')
        .unsigned()
        .notNullable()
        .references('products.id')
        .onDelete('CASCADE')
      table.integer('rating').unsigned().notNullable() // rating 1-5
      table.text('comment').nullable()
      table.json('images').nullable() // kalau user bisa upload foto
      table.boolean('is_verified_purchase').defaultTo(false)
      table.integer('likes').unsigned().defaultTo(0)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table.timestamp('deleted_at').nullable()

      // Optional: Unique constraint biar 1 user cuma bisa review 1x per produk
      table.unique(['user_id', 'product_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}