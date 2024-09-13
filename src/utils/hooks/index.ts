'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const useDialogState = (defaultValue = false) => {
  const [open, setOpen] = useState(defaultValue)
  const pathname = usePathname()

  const intialPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== intialPathname.current) {
      setOpen(false)
      intialPathname.current = pathname
    }
  }, [pathname, open])
  return [open, setOpen] as const
}
