import { BaseComponent } from '@/utils/types'

export const Container = ({ children, className }: BaseComponent) => {
  return <div className={`container mx-auto px-4 ${className}`}>{children}</div>
}
