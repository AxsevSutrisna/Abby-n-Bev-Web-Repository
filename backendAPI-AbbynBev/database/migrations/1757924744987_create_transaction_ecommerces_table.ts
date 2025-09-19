import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_ecommerces'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Relasi ke transaksi utama
      table
        .integer('transaction_id')
        .unsigned()
        .references('id')
        .inTable('transactions')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      // Relasi ke user
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      // Pajak & biaya
      table.decimal('ppn', 12, 2).defaultTo(0)
      table.decimal('shipping_cost', 12, 2).defaultTo(0)

      // Kurir
      table.string('courier_name').nullable()
      table.string('courier_service').nullable()

      // Midtrans
      table.text('token_midtrans').nullable()
      table.text('redirect_url').nullable()
      table.string('payment_method').nullable()
      table.string('receipt').nullable()

      // Relasi ke alamat user
      table
        .integer('user_addresses_id')
        .unsigned()
        .references('id')
        .inTable('user_addresses')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
        .nullable()

      // Relasi ke voucher
      table
        .integer('voucher_id')
        .unsigned()
        .references('id')
        .inTable('vouchers')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
        .nullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
