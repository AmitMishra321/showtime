import { schemaCreateAdmin } from '@/forms/createAdmin'
import { CreateTRPCRouter, protectedProcedure } from '..'
import { TRPCError } from '@trpc/server'

export const adminRouter = CreateTRPCRouter({
  dashboard: protectedProcedure('admin').query(async ({ ctx }) => {
    const [cinema, movie, admin, manager, user] = await Promise.all([
      ctx.db.cinema.count(),
      ctx.db.movie.count(),
      ctx.db.admin.count(),
      ctx.db.manager.count(),
      ctx.db.user.count(),
    ])
    return { cinema, movie, admin, manager, user }
  }),
  findAll: protectedProcedure('admin').query(({ ctx }) => {
    return ctx.db.admin.findMany({ include: { User: true } })
  }),
  adminMe: protectedProcedure().query(({ ctx }) => {
    return ctx.db.admin.findUnique({ where: { id: ctx.userId } })
  }),
  create: protectedProcedure('admin')
    .input(schemaCreateAdmin)
    .mutation(async ({ ctx, input }) => {
      const admin = await ctx.db.admin.findUnique({ where: input })

      if (admin) {
        return new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The user is already an admin',
        })
      }
      return ctx.db.admin.create({ data: input })
    }),
})
