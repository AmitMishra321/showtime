'use client'
import { trpcClient } from '@/trpc/clients/client'

export default function Home() {
  const movies = trpcClient.movies.movies.useQuery()
  return (
    <main className="bg-gray-400">
      Hello World
      {movies.data?.map((movie) => <div key={movie.id}>{movie.title}</div>)}
    </main>
  )
}
