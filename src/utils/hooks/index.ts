'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../config/firebase'
import { catchError, debounceTime, EMPTY, Subject, tap } from 'rxjs'
import { trpcClient } from '@/trpc/clients/client'

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

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [percent, setPercent] = useState(0)

  const handleUpload = async (files: FileList): Promise<string[]> => {
    if (!files?.length) {
      return []
    }

    setUploading(true)

    const uploadTasks = Array.from(files).map((file: File) => {
      const storageRef = ref(storage, `/files/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            )
            setPercent(percent)
          },
          reject,
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject)
          },
        )
      })
    })

    try {
      const imageUrls = await Promise.all(uploadTasks)

      setUploading(false)
      return imageUrls
    } catch (err) {
      console.log(err)
      setUploading(false)
      return []
    }
  }

  return [{ uploading, percent }, handleUpload] as const
}

export const useDebounce = (delay: number = 1000) => {
  const [debouncedSet$] = useState(() => new Subject<() => void>())
  useEffect(() => {
    const subscription = debouncedSet$
      .pipe(
        debounceTime(delay),
        tap((func) => func()),
        catchError(() => EMPTY),
      )
      .subscribe()
    return () => subscription.unsubscribe()
  }, [delay, debouncedSet$])

  return debouncedSet$
}

export const useDebouncedValue = <T>(value: T, delay: number = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const debouncedSet$ = useDebounce(delay)

  useEffect(() => {
    debouncedSet$.next(() => setDebouncedValue(value))
  }, [debouncedSet$, value])

  return debouncedValue
}

export type LocationInfo = { placeName: string; latLng: [number, number] }

export const useSearchLocation = () => {
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [locationInfo, setLocationInfo] = useState<LocationInfo[]>(() => [])

  const debouncedSearchText = useDebouncedValue(searchText, 300)

  useEffect(() => {
    setLoading(true)
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${debouncedSearchText}.json?fuzzyMatch=true&access_token=pk.eyJ1IjoiaWFta2FydGhpY2siLCJhIjoiY2t4b3AwNjZ0MGtkczJub2VqMDZ6OWNrYSJ9.-FMKkHQHvHUeDEvxz2RJWQ`,
    )
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.features?.map(
          (x: { place_name: string; center: [number, number] }) => ({
            placeName: x.place_name,
            latLng: [x.center[1], x.center[0]],
          }),
        )

        setLocationInfo(filtered)
      })
      .finally(() => setLoading(false))
  }, [debouncedSearchText, setLocationInfo])

  return { loading, setLoading, searchText, setSearchText, locationInfo }
}

export const useKeypress = (keys: string[], action?: Function) => {
  useEffect(() => {
    const onKeyup = (e: { key: any }) => {
      if (keys.includes(e.key) && action) action()
    }
    window.addEventListener('keyup', onKeyup)
    return () => window.removeEventListener('keyup', onKeyup)
  }, [action, keys])
}

export const useHandleSearch = () => {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const pathname = usePathname()

  const router = useRouter()

  const addParams = (key: string, value: string | number) => {
    params.set(key, value.toString())

    router.replace(`${pathname}?${params}`)
  }

  const deleteParam = (key: string) => {
    params.delete(key)
  }
  const deleteAll = () => {
    router.replace('/')

    console.log('deleteAll.params', params.toString())
  }
  return { params, addParams, deleteAll, deleteParam }
}

export function useGetCinema({ cinemaId }: { cinemaId: string | null }) {
  const { data, refetch } = trpcClient.cinemas.cinema.useQuery(
    { id: +(cinemaId || '') },
    { enabled: false },
  )

  useEffect(() => {
    if (cinemaId) {
      refetch()
    }
  }, [refetch, cinemaId])

  return { cinema: data }
}
