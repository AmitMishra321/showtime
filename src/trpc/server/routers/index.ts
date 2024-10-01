import { CreateTRPCRouter } from '..'
import { adminRouter } from './admin'
import { cinemasRouter } from './cinemas'
import { mangerRoutes } from './managers'
import { moviesRouter } from './movies'
import { showtimesRoutes } from './showtimes'

export const appRouter = CreateTRPCRouter({
  movies: moviesRouter,
  admins: adminRouter,
  cinemas: cinemasRouter,
  showtimes: showtimesRoutes,
  managers: mangerRoutes,
})

export type AppRouter = typeof appRouter
