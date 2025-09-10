import { DateTime } from 'luxon'
import { afterFetch, afterFind, column, belongsTo, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import drive from '@adonisjs/drive/services/main'
import env from '#start/env'
import { CustomBaseModel } from '#services/custom_base_model'

export default class ProductMedia extends CustomBaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare url: string

  @column()
  declare altText: string | null

  @column()
  declare productId: number

  @column()
  declare type: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  // Scope untuk mengambil hanya data yang tidak terhapus
  public static active = scope((query) => {
    return query.whereNull('deleted_at')
  })

  // Scope untuk mengambil hanya data yang sudah dihapus
  public static trashed = scope((query) => {
    query.whereNotNull('deleted_at')
  })

  // Soft delete method
  public async softDelete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }

  // Restore method untuk mengembalikan data yang terhapus
  public async restore() {
    this.deletedAt = null
    await this.save()
  }

  public async getImageUrl() {
    if (this.url) {
      this.url = await drive.use(env.get('DRIVE_DISK')).getSignedUrl(this.url)
    }
  }

  @afterFetch()
  public static async getImageUrlAfterFetch(models: ProductMedia[]) {
    for (const model of models) {
      await model.getImageUrl()
    }
  }

  @afterFind()
  public static async getImageUrlAfterFind(model: ProductMedia) {
    await model.getImageUrl()
  }
}
