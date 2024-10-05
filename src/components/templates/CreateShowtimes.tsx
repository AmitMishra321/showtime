'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { revalidatePath } from '@/utils/actions/revalidatePath'
import { Plus } from 'lucide-react'
import { useToast } from '../molecules/Toaster/use-toast'
import { trpcClient } from '@/trpc/clients/client'
import { FormTypeCreateShowtime } from '@/forms/createShowtime'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'

export default function CreateShowtimes() {
  const {
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext<FormTypeCreateShowtime>()
  const {
    data,
    error,
    mutateAsync: createShowtime,
  } = trpcClient.showtimes.create.useMutation()

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (data) {
      reset()
      toast({ title: 'Showtimes created.' })
      router.replace('/manager/cinemas')
      revalidatePath('/manager/cinemas')
    }
  }, [data, reset, router, toast])
  useEffect(() => {
    if (error) {
      toast({ title: 'Action failed.' })
    }
  }, [error, toast])
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log('form submited:', data)
        await createShowtime(data)
      })}
    >
      <SelectMovie />
      <SelectScreen />
      <AddShows />
      <Button type="submit" className="bg-red-500">
        Submit
      </Button>
    </form>
  )
}

export const SelectMovie = () => {
  const { data, isLoading } = trpcClient.movies.movies.useQuery()
  const { setValue } = useFormContext<FormTypeCreateShowtime>()
  return (
    <Label title="Movie">
      <select
        onChange={(event) => setValue('movieId', Number(event.target.value))}
        className="w-full px-3 py-2 border rounded border-input"
      >
        {isLoading ? (
          <option value="">Loading ...</option>
        ) : (
          <option value="">Select a movie ...</option>
        )}

        {data?.map((movie) => (
          <option value={movie.id} key={movie.id}>
            {movie.title}
          </option>
        ))}
      </select>
    </Label>
  )
}

export const SelectScreen = () => {
  const { data, isLoading } = trpcClient.cinemas.myScreen.useQuery()
  const { setValue } = useFormContext<FormTypeCreateShowtime>()
  return (
    <Label title="Screen Number">
      <select
        onChange={(event) => setValue('screenId', Number(event.target.value))}
        className="w-full px-3 py-2 border rounded border-input"
      >
        {isLoading ? (
          <option value="">Loading ...</option>
        ) : (
          <option value="">Select a screen ...</option>
        )}

        {data?.map((screen) => (
          <option value={screen.id} key={screen.id}>
            {screen.cinema.name}- {screen.number}
          </option>
        ))}
      </select>
    </Label>
  )
}
export const AddShows = () => {
  const { control, register } = useFormContext<FormTypeCreateShowtime>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'showtimes',
  })
  return (
    <div>
      <Label title="Shows">
        <div className="grid grid-cols-3 gap-2">
          {fields.map((showtime, showtimeIndex) => (
            <div className="" key={showtime.id}>
              <Label key={showtime.id}>
                <Input
                  {...register(`showtimes.${showtimeIndex}.time`)}
                  type="datetime-local"
                />
              </Label>
              <Button
                className="text-red-500 flex items-center justify-center w-full py-2 mt-2 text-xs border border-dashed"
                size="sm"
                variant="link"
                onClick={() => remove(showtimeIndex)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Label>

      <Button
        className="text-red-500 border-dashed flex items-center justify-center w-full py-2 mt-2 text-xs border"
        size="sm"
        variant="link"
        onClick={() =>
          append({
            time: '',
          })
        }
      >
        <Plus className="w-4 h-4" /> Add show
      </Button>
    </div>
  )
}
