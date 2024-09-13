import { Role } from '@/utils/types'
import prisma from '@/db/prisma'

export const getUserRoles = async (id: string): Promise<Role[]> => {
  const [adminExists, managerExists] = await Promise.all([
    prisma.admin.findUnique({ where: { id } }),
    prisma.manager.findUnique({ where: { id } }),
  ])

  const roles: Role[] = []

  if (adminExists) {
    roles.push('admin')
  }

  if (managerExists) {
    roles.push('manager')
  }

  return roles
}
