import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaction_shipments'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status').nullable().after('resi_number') // atau setelah field lain yang relevan
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })
  }
}
