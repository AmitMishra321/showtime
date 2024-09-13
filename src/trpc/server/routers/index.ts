import { CreateTRPCRouter } from '..'
import { adminRouter } from './admin'
import { moviesRouter } from './movies'

export const appRouter = CreateTRPCRouter({
  movies: moviesRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
