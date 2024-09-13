import { AppRouter } from '@/trpc/server/routers'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
