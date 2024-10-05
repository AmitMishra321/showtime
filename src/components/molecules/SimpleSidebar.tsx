import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../atoms/sheet'
import { Button } from '../atoms/button'
import { BaseComponent } from '@/utils/types'
export function SimpleSidebar({ children }: BaseComponent) {
  return (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Menu className="w-5 h-5 text-red-500" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="text-red-500">
          {children}
        </SheetContent>
      </Sheet>
    </div>
  )
}
