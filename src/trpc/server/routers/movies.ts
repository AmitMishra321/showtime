import { schemaCreateMovie } from '@/forms/createMovie'
import { publicProcedure, CreateTRPCRouter, protectedProcedure } from '..'

export const moviesRouter = CreateTRPCRouter({
  movies: publicProcedure.query(({ ctx }) => {
    return ctx.db.movie.findMany()
  }),
  createMovie: protectedProcedure('admin')
    .input(schemaCreateMovie)
    .mutation(({ ctx, input }) => {
      return ctx.db.movie.create({ data: input })
    }),
})
