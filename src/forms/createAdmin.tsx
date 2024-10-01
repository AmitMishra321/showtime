import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const schemaCreateAdmin = z.object({
  id: z.string().min(1, { message: 'Admin id is required' }),
})

export type FormTypeCreateAdmin = z.infer<typeof schemaCreateAdmin>

export const useFormCreateAdmin = () =>
  useForm<FormTypeCreateAdmin>({
    resolver: zodResolver(schemaCreateAdmin),
  })
