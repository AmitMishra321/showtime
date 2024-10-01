'use client'

import { FormTypeCreateAdmin, useFormCreateAdmin } from '@/forms/createAdmin'
import { trpcClient } from '@/trpc/clients/client'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { useToast } from '../molecules/Toaster/use-toast'
import { revalidatePath } from '@/utils/actions/revalidatePath'
import { Label } from '../atoms/label'
import { useEffect } from 'react'

export const CreateAdmin = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormCreateAdmin()
  const {
    mutateAsync: createAdmin,
    isPending,
    error,
    data,
  } = trpcClient.admins.create.useMutation()
  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      toast({ title: error?.data?.code })
    }
  }, [error, toast])
  useEffect(() => {
    if (data) {
      reset()
      toast({ title: 'Admin Created' })
      revalidatePath('/admin/admins')
    }
  }, [data, reset, toast])
  return (
    <form
      onSubmit={handleSubmit(async (data: FormTypeCreateAdmin) => {
        await createAdmin(data)
      })}
    >
      <Label title="UID" error={errors.id?.message}>
        <Input placeholder="Enter the uid" {...register('id')} />
      </Label>
      <Button
        loading={isPending}
        type="submit"
        variant="destructive"
        className="p-2 m-1"
      >
        Submit
      </Button>
    </form>
  )
}
