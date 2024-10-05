import { trpcClient } from '@/trpc/clients/client'
import { useHandleSearch } from '@/utils/hooks'
import { AlertBox } from '../molecules/AlertBox'
import { Title2 } from '../atoms/typography'
import { Loading } from '../molecules/Loading'
import { CinemaSelectCard } from './CinemaSelectCard'

export const SelectMovie = ({ cinemaId }: { cinemaId: number }) => {
  const { data, isLoading } = trpcClient.movies.moviesPerCinema.useQuery({
    cinemaId: 16,
  })

  const { params, addParams, deleteParam } = useHandleSearch()
  if (data?.length === 0) {
    return (
      <AlertBox className="">
        Currently no shows running in this cinema
      </AlertBox>
    )
  }

  return (
    <div className="">
      <Title2 className="">Select Movie</Title2>
      {isLoading ? <Loading /> : null}

      <div className="grid grid-cols-3 gap-2">
        {data?.map((movie) => (
          <button
            key={movie.id}
            onClick={() => {
              addParams('movieId', movie.id)
              deleteParam('showtimeId')
              deleteParam('screenId')
            }}
          >
            <CinemaSelectCard
              movie={movie}
              selected={params.get('movieId') === movie.id.toString()}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
