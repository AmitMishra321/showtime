import 'server-only'

import { createTRPCClient, TRPCClientError } from '@trpc/client'
import { callTRPCProcedure } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { type TRPCErrorResponse } from '@trpc/server/rpc'
import { headers } from 'next/headers'
import { cache } from 'react'

import { createTRPCContext } from '../server'
import { appRouter, AppRouter } from '../server/routers'

const createContext = cache(() => {
  const heads = new Headers(headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    headers: heads,
  })
})

export const trpcServer = createTRPCClient<AppRouter>({
  links: [
    () =>
      ({ op: { path, type, input } }) =>
        observable((observer) => {
          createContext()
            .then((ctx) => {
              // console.log(
              //   `path, type , input,appRouter._def.procedures

              //     `,
              //   path,
              //   type,
              //   input,
              //   appRouter._def.procedures,
              // )
              return callTRPCProcedure({
                ctx,
                path,
                type,
                getRawInput: () => input as unknown as Promise<unknown>,
                procedures: appRouter._def.procedures,
              })
            })
            .then((data) => {
              observer.next({ result: { data } })
              observer.complete()
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause))
            })
        }),
  ],
})
