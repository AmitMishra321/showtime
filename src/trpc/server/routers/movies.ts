import { schemaCreateMovie } from '@/forms/createMovie'
import { publicProcedure, CreateTRPCRouter, protectedProcedure } from '..'
import { z } from 'zod'

export const moviesRouter = CreateTRPCRouter({
  movies: publicProcedure.query(({ ctx }) => {
    return ctx.db.movie.findMany()
  }),
  createMovie: protectedProcedure('admin')
    .input(schemaCreateMovie)
    .mutation(({ ctx, input }) => {
      return ctx.db.movie.create({ data: input })
    }),

  moviesPerCinema: publicProcedure
    .input(z.object({ cinemaId: z.number() }))
    .query(({ ctx, input: { cinemaId } }) => {
      return ctx.db.movie.findMany({
        where: {
          showtime: {
            some: { startTime: { gt: new Date() }, Screen: { cinemaId } },
          },
        },
      })
    }),
})
