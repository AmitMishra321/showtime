import { schemaCreateCinema } from '@/forms/createCinema'
import { publicProcedure, CreateTRPCRouter, protectedProcedure } from '..'

export const cinemasRouter = CreateTRPCRouter({
  cinemas: publicProcedure.query(({ ctx }) => {
    return ctx.db.cinema.findMany({
      include: {
        Screen: { include: { showtimes: { include: { Movie: true } } } },
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
