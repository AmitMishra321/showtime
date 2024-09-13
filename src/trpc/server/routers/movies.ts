import { publicProcedure, CreateTRPCRouter } from '..'

export const moviesRouter = CreateTRPCRouter({
  movies: publicProcedure.query(({ ctx }) => {
    return ctx.db.movie.findMany()
  }),
})
