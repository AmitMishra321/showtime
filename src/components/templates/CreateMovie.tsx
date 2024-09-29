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
import { useImageUpload } from '@/utils/hooks'
import { ImagePreview } from '../molecules/ImagePreview'
import { ProgressBar } from '../molecules/ProgressBar'
import { Controller } from 'react-hook-form'

export interface CreateMovieProps {}

export const CreateMovie = ({}: CreateMovieProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    resetField,
    formState: { errors },
  } = useFormCreateMovie()

  const { isPending, mutateAsync: createMovie } =
    trpcClient.movies.createMovie.useMutation()

  const [{ percent, uploading }, uploadImages] = useImageUpload()
  const { toast } = useToast()
  const { replace } = useRouter()
  const { posterUrl } = watch()
  return (
    <div>
      <form
        onSubmit={handleSubmit(
          async ({ director, duration, genre, releaseDate, title }) => {
            const uploadedImages = await uploadImages(posterUrl)

            const movie = await createMovie({
              director,
              duration,
              genre,
              releaseDate,
              title,
              posterUrl: uploadedImages[0],
            })
            if (movie) {
              reset()
              toast({ title: 'Movie created successfully.' })
              revalidatePath('admins/movies')
              replace('/admin/movies')
            }
          },
        )}
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label title="title" error={errors.title?.message}>
              <Input placeholder="Title" {...register('title')} />
            </Label>
            <Label title="director name" error={errors.director?.message}>
              <Input placeholder="Director name" {...register('director')} />
            </Label>
            <Label title="Duration" error={errors.duration?.message}>
              <Input
                placeholder="Duration"
                {...register('duration', { valueAsNumber: true })}
              />
            </Label>
            <Label title="Release date" error={errors.releaseDate?.message}>
              <Input
                placeholder="Release date"
                type="date"
                {...register('releaseDate', {
                  setValueAs: (value) => {
                    const date = new Date(value)
                    return isNaN(date.getTime()) ? '' : date.toISOString()
                  },
                })}
              />
            </Label>
            <Label title="Genre" error={errors.genre?.message}>
              <HtmlSelect placeholder="projection type" {...register(`genre`)}>
                {Object.values(Genre).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </HtmlSelect>
            </Label>
          </div>
          <Label title="Images" error={errors.posterUrl?.message?.toString()}>
            <ImagePreview
              src={posterUrl || ''}
              clearImage={() => resetField('posterUrl')}
            >
              <Controller
                control={control}
                name={`posterUrl`}
                render={({ field }) => (
                  <Input
                    type="file"
                    accept="image/*"
                    multiple={false}
                    onChange={(e) => field.onChange(e?.target?.files)}
                  />
                )}
              />
            </ImagePreview>

            {percent > 0 ? <ProgressBar value={percent} /> : null}
          </Label>
        </div>
        <Button loading={isPending || uploading} type="submit">
          Submit
        </Button>
      </form>
    </div>
  )
}
