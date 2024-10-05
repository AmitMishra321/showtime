import { schemaCreateCinema } from '@/forms/createCinema'
import { publicProcedure, CreateTRPCRouter, protectedProcedure } from '..'
import { findManyCinemaArgsSchema } from './input/cinemas.input'
import { z } from 'zod'
import { locationFilter } from './input/common.input'

export const cinemasRouter = CreateTRPCRouter({
  cinema: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input: { id } }) => {
      return ctx.db.cinema.findUnique({
        where: { id },
        include: {
          Address: true,
        },
      })
    }),
  searchCinemas: publicProcedure
    .input(findManyCinemaArgsSchema)
    .input(z.object({ locationFilter }))
    .query(({ ctx, input }) => {
      const { cursor, distinct, orderBy, skip, take, where, locationFilter } =
        input
      const { ne_lat, ne_lng, sw_lat, sw_lng } = locationFilter
      return ctx.db.cinema.findMany({
        cursor,
        distinct,
        orderBy,
        skip,
        take,
        where: {
          ...where,
          Address: {
            lat: { lte: ne_lat, gte: sw_lat },
            lng: { lte: ne_lng, gte: sw_lng },
          },
        },
        include: {
          Address: true,
        },
      })
    }),
  cinemas: publicProcedure.query(({ ctx }) => {
    return ctx.db.cinema.findMany({
      include: {
        Screen: { include: { showtimes: { include: { Movie: true } } } },
      },
    })
  }),
  myCinemas: protectedProcedure('manager').query(({ ctx }) => {
    return ctx.db.cinema.findMany({
      where: { Managers: { some: { id: ctx.userId } } },
      include: {
        Screen: {
          include: { showtimes: { include: { Movie: true, Bookings: true } } },
        },
      },
    })
  }),
  myScreen: protectedProcedure().query(({ ctx }) => {
    return ctx.db.screen.findMany({
      where: { cinema: { Managers: { some: { id: ctx.userId } } } },
      include: {
        cinema: true,
      },
    })
  }),
  createCinema: protectedProcedure('admin')
    .input(schemaCreateCinema)
    .mutation(({ ctx, input }) => {
      const { address, cinemaName, screens, managerId } = input

      const screenWithSeats = screens.map((screen, index) => {
        const { rows, columns, ...screenData } = screen
        const seats = []
        for (let row = 1; row <= rows; row++) {
          for (let column = 1; column <= columns; column++) {
            seats.push({ row, column })
          }
        }
        return {
          ...screenData,
          seats: { create: seats },
          number: index,
        }
      })

      return ctx.db.cinema.create({
        data: {
          name: cinemaName,
          Address: { create: address },
          Managers: {
            connectOrCreate: {
              create: { id: managerId },
              where: { id: managerId },
            },
          },
          Screen: { create: screenWithSeats },
        },
      })
    }),
})
