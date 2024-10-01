'use client'

import { trpcClient } from '@/trpc/clients/client'
import { Input } from '../atoms/input'
import {
  FormTypeCreateManager,
  useFormCreateManager,
} from '@/forms/createManagers'
import { Button } from '../atoms/button'
import { useToast } from '../molecules/Toaster/use-toast'
import { revalidatePath } from '@/utils/actions/revalidatePath'
import { Label } from '../atoms/label'

export const CreateManagers = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormCreateManager()
  const { mutateAsync: createManager, isPending } =
    trpcClient.managers.create.useMutation()
  const { toast } = useToast()
  return (
    <form
      onSubmit={handleSubmit(async (data: FormTypeCreateManager) => {
        const manger = await createManager(data)
        if (manger) {
          reset()
          toast({ title: 'Manger Created' })
          revalidatePath('/admin/managers')
        } else {
          toast({ title: 'Action Failed' })
        }
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
