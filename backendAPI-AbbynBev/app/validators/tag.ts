import vine from '@vinejs/vine'

/**
 * Validator untuk CREATE (store) tag
 */
export const storeTagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100),
    description: vine.string().optional(),
  })
)

/**
 * Validator untuk UPDATE tag
 */
export const updateTagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(100).optional(),
    description: vine.string().optional(),
  })
)
