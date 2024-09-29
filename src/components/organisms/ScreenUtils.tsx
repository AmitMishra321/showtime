import { cn } from '@/utils/styles'

export const Square = ({ booked = false, selected = false }) => {
  return (
    <div
      className={cn(
        'w-5 transition-all h-5 border border-black/50 rounded shadow-md',
        booked ? 'bg-gray-200 shadow-inner border-0 ' : null,
        selected
          ? 'bg-primary-500 p-1 border-0 shadow-black/30 shadow-lg'
          : null,
      )}
    />
  )
}
