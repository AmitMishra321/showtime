import { CreateTRPCRouter, protectedProcedure } from '..'

export const adminRouter = CreateTRPCRouter({
  movies: protectedProcedure('admin').query(({ ctx }) => {
    return ctx.db.admin.findMany()
  }),
  adminMe: protectedProcedure().query(({ ctx }) => {
    const id = ctx.session.userId
    if (!id)
      return ctx.db.admin.findUnique({
        where: {
          id: ctx.userId,
        },
      })

    return ctx.db.admin.findFirst()
  }),
})
