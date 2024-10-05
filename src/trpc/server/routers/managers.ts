import { schemaCreateManager } from '@/forms/createManagers'
import { CreateTRPCRouter, protectedProcedure } from '..'

export const mangerRoutes = CreateTRPCRouter({
  create: protectedProcedure('admin')
    .input(schemaCreateManager)
    .mutation(({ ctx, input }) => {
      return ctx.db.manager.create({ data: input })
    }),
  findAll: protectedProcedure('admin').query(({ ctx }) => {
    return ctx.db.manager.findMany({ include: { User: true } })
  }),
  managerMe: protectedProcedure().query(({ ctx }) => {
    return ctx.db.manager.findUnique({ where: { id: ctx.userId } })
  }),
  dashboard: protectedProcedure('admin', 'manager').query(async ({ ctx }) => {
    const uid = ctx.userId
    const [cinema, showtimes] = await Promise.all([
      ctx.db.cinema.count({ where: { Managers: { some: { id: uid } } } }),

      ctx.db.showtime.count({
        where: { Screen: { cinema: { Managers: { some: { id: uid } } } } },
      }),
    ])
    return { cinema, showtimes }
  }),
})
