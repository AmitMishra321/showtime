import { auth } from '@clerk/nextjs/server'
import { initTRPC, TRPCError } from '@trpc/server'
import prisma from '@/db/prisma'
import { Role } from '@/utils/types'
import { getUserRoles } from './utils'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = auth()

  return {
    db: prisma,
    session,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

export const CreateTRPCRouter = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = (...roles: Role[]) =>
  t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.session.userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized',
      })
    }

    await authorizeUser(ctx.session.userId, roles)

    return next({
      ctx: {
        ...ctx,
        userId: ctx.session.userId,
      },
    })
  })

export const authorizeUser = async (
  uid: string,
  roles: Role[],
): Promise<void> => {
  if (!roles || roles.length === 0) {
    return // No specific roles required, access is granted
  }

  const userRoles = await getUserRoles(uid)

  if (!userRoles.some((role) => roles.includes(role))) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User does not have the required role(s).',
    })
  }
}

export const checkRowLevelPermission = async (
  uid: string,
  allowedUids: string | string[],
  allowedRoles: Role[] = ['admin'],
) => {
  const userRoles = await getUserRoles(uid)

  if (userRoles?.some((role) => allowedRoles.includes(role))) {
    return true
  }

  const uids =
    typeof allowedUids === 'string'
      ? [allowedUids]
      : allowedUids.filter(Boolean)

  if (!uids.includes(uid)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to do this action.',
    })
  }
}
