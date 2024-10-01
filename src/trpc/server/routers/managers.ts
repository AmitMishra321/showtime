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
})
