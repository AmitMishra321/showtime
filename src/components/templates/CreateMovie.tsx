'use client'

import { useFormCreateMovie } from '@/forms/createMovie'
import { Input } from '../atoms/input'
import { Label } from '../atoms/label'
import { Button } from '../atoms/button'
import { HtmlSelect } from '../atoms/select'
import { Genre } from '@prisma/client'
import { trpcClient } from '@/trpc/clients/client'
import { useToast } from '../molecules/Toaster/use-toast'
import { useRouter } from 'next/navigation'
import { revalidatePath } from '@/utils/actions/revalidatePath'
export interface CreateMovieProps {}

export const CreateMovie = ({}: CreateMovieProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormCreateMovie()

  const { isPending, mutateAsync } = trpcClient.movies.createMovie.useMutation()
  const { toast } = useToast()
  const router = useRouter()
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log('form data', data)
        const movie = await mutateAsync(data)
        if (movie) {
          reset()
          toast({
            title: `Movie ${movie.title} created successfully`,
            description: 'Your movie has been created successfully',
          })
          revalidatePath('/admin/movies')
          router.replace(`/admin/movies`)
        }
      })}
    >
      <Label title="Title" error={errors.title?.message}>
        <Input {...register('title')} placeholder="Enter Movie Title" />
      </Label>
      <Label title="Director Name" error={errors.director?.message}>
        <Input {...register('director')} placeholder="Enter Director Name" />
      </Label>
      <Label title="Duration" error={errors.duration?.message}>
        <Input
          {...register('duration', { valueAsNumber: true })}
          placeholder="Enter Duration"
        />
      </Label>
      <Label title="Release Date" error={errors.releaseDate?.message}>
        <Input
          type="date"
          {...register('releaseDate', {
            setValueAs: (value) => {
              const date = new Date(value)
              return isNaN(date.getTime()) ? '' : date.toISOString()
            },
          })}
          placeholder="Enter Release Date"
        />
      </Label>
      <Label title="Genre" error={errors.genre?.message}>
        <HtmlSelect {...register('genre')} placeholder="projection type">
          {Object.values(Genre).map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </HtmlSelect>
      </Label>
      <Button loading={isPending} type="submit">
        Submit
      </Button>
    </form>
  )
}
