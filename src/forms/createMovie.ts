import { z } from 'zod'
import { Genre } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const schemaCreateMovie = z.object({
  genre: z.nativeEnum(Genre),
  title: z.string().min(1, { message: 'Movie name is required' }),
  director: z.string().min(1, { message: 'Director name is required' }),
  duration: z.number({ invalid_type_error: 'Duration is required' }),
  releaseDate: z.string().date(),
  posterUrl: z.any(),
})

export type FormTypeCreateMovie = z.infer<typeof schemaCreateMovie>

export const useFormCreateMovie = () =>
  useForm<FormTypeCreateMovie>({
    resolver: zodResolver(schemaCreateMovie),
    defaultValues: {
      director: '',
      duration: 0,
      genre: Genre.ACTION,
      releaseDate: '',
      title: '',
      posterUrl: '',
    },
  })
