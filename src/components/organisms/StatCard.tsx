import Link from 'next/link'
import { ReactNode } from 'react'

export const StatCard = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <div className="text-lg capitalize">{title}</div>
      <div className="text-2xl font-bold">{children}</div>
    </div>
  )
}
