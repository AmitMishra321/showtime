'use client'
import { FormProviderCreateShowtime } from '@/forms/createShowtime'
import CreateShowtimes from '@/components/templates/CreateShowtimes'

export default function page() {
  return (
    <FormProviderCreateShowtime>
      <CreateShowtimes />
    </FormProviderCreateShowtime>
  )
}
