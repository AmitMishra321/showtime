import { CreateTRPCRouter } from '..'
import { adminRouter } from './admin'
import { cinemasRouter } from './cinemas'
import { moviesRouter } from './movies'
import { showtimesRoutes } from './showtimes'

export const appRouter = CreateTRPCRouter({
  movies: moviesRouter,
  admin: adminRouter,
  cinemas: cinemasRouter,
  showtimes: showtimesRoutes,
})

export type AppRouter = typeof appRouter
