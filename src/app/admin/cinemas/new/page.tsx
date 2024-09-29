'use client'

import { FormProviderCreateCinema } from '@/forms/createCinema'
import { CreateCinema } from '@/components/templates/CreateCinema'

export default function Page() {
  return (
    <FormProviderCreateCinema>
      <CreateCinema />
    </FormProviderCreateCinema>
  )
}
