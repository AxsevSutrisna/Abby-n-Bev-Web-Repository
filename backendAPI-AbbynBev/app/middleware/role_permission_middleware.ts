import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { Role } from '../enums/role.js'

export default class RolePermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn, roles: Role[]) {
    const userRole = Number(ctx.auth?.user?.role)

    if (!userRole) {
      return ctx.response.status(403).send({ message: 'Forbidden Resource' })
    }
    if (!roles.includes(userRole) && userRole !== Role.ADMINISTRATOR) {
      console.warn(`Access denied for role ${userRole} on ${ctx.request.url()}`)
      return ctx.response.status(403).send({ message: 'Forbidden Resource' })
    }

    return await next()
  }
}
