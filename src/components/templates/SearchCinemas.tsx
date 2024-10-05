'use client'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Map } from '../organisms/Map'
import { Panel } from '../organisms/Map/Panel'
import { DefaultZoomControls } from '../organisms/Map/ZoomControls'
import { MapPinnedIcon } from 'lucide-react'
import { LngLatBounds, useMap } from 'react-map-gl'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../atoms/dialog'
import { cities } from '@/utils/static'
import { useGetCinema, useHandleSearch, useKeypress } from '@/utils/hooks'
import { trpcClient } from '@/trpc/clients/client'
import { Marker } from '../organisms/Map/MapMarker'
import { RouterOutputs } from '@/trpc/clients/types'
import { BrandIcon } from './CreateCinema'
import { SelectMovie } from '../organisms/SelectMovie'

interface SimpleDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  children: React.ReactNode
}

export const SimpleDialog = ({
  open,
  setOpen,
  title,
  children,
}: SimpleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hidden"></button>
      </DialogTrigger>
      <DialogContent
        className={`lg:max-w-screen-lg overflow-y-scroll max-h-screen`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
export const SearchCinemas = () => {
  return (
    <Map>
      <Panel position="right-center">
        <DefaultZoomControls />
      </Panel>
      <DisplayCinemas />
      <Panel position="left-top">
        <SetCity />
      </Panel>
    </Map>
  )
}

export const SetCity = () => {
  const [open, setOpen] = useState(false)
  const { current: map } = useMap()

  useKeypress(['l'], () => setOpen((state) => !state))
  return (
    <div className="">
      <button
        className="flex flex-col items-center gap-1"
        onClick={() => setOpen(true)}
      >
        <MapPinnedIcon />
        <div className="flex items-center justify-center w-4 h-4 border rounded shadow">
          L
        </div>
      </button>
      <SimpleDialog open={open} setOpen={setOpen} title="Select City">
        <div className="grid grid-cols-3 gap-3">
          {cities.map((city) => (
            <button
              className="p-3 rounded hover:shadow-2xl transition-shadow border text-clip"
              key={city.id}
              onClick={() => {
                map?.flyTo({
                  center: { lat: city.lat, lng: city.lng },
                  zoom: 10,
                  essential: true,
                })
                setOpen(false)
              }}
            >
              <div className="">{city.name}</div>
              <div className="">{city.englishName}</div>
            </button>
          ))}
        </div>
      </SimpleDialog>
    </div>
  )
}

export const DisplayCinemas = () => {
  const { current: map } = useMap()
  const [bounds, setBounds] = useState<LngLatBounds>()

  useEffect(() => {
    const handleBounds = () => {
      const bounds = map?.getBounds()
      if (bounds) {
        setBounds(bounds)
      }
    }
    map?.on('load', handleBounds)
    map?.on('dragend', handleBounds)
    map?.on('zoomend', handleBounds)
  }, [map])

  const locationFilter = useMemo(
    () => ({
      ne_lat: bounds?.getNorthEast().lat || 0,
      ne_lng: bounds?.getNorthEast().lng || 0,
      sw_lat: bounds?.getSouthWest().lat || 0,
      sw_lng: bounds?.getSouthWest().lng || 0,
    }),
    [bounds],
  )
  const { data } = trpcClient.cinemas.searchCinemas.useQuery({ locationFilter })

  return (
    <>
      <MovieDialog />
      {data?.map((cinema) => <MarkerCinema cinema={cinema} key={cinema.id} />)}
    </>
  )
}

export const MarkerCinema = ({
  cinema,
}: {
  cinema: RouterOutputs['cinemas']['searchCinemas'][0]
}) => {
  const { addParams } = useHandleSearch()
  if (!cinema.Address?.lat || !cinema.Address?.lng || !cinema.id) {
    return null
  }

  return (
    <Marker
      anchor="bottom"
      longitude={cinema.Address.lng}
      latitude={cinema.Address.lat}
      onClick={() => {
        addParams('cinemaId', cinema.id)
      }}
      className="cursor-pointer"
    >
      <BrandIcon />
      <MarkerText>{cinema.name.split(' ').slice(0, 2).join('')}</MarkerText>
    </Marker>
  )
}

export const MovieDialog = () => {
  const { params, deleteAll } = useHandleSearch()
  const cinemaId = params.get('cinemaId')

  const { cinema } = useGetCinema({ cinemaId })

  const { current: map } = useMap()
  const [openDialog, setOpenDialog] = useState(Boolean(cinemaId))
  useEffect(() => {
    if (cinema?.Address) {
      setOpenDialog(true)
      console.log('cinema', cinema.Address.lat, cinema.Address.lng)
      map?.flyTo({
        center: { lat: cinema.Address.lat, lng: cinema.Address.lng },
        zoom: 10,
        essential: true,
      })
    } else {
      setOpenDialog(false)
    }
  }, [cinema, map])

  if (!cinema) {
    return null
  }
  return (
    <SimpleDialog
      title="Book Tickets"
      open={openDialog}
      setOpen={(state) => {
        deleteAll(), setOpenDialog(state)
      }}
    >
      {cinema?.name}
      <div className="">
        <SelectMovie cinemaId={cinema.id} />
      </div>
    </SimpleDialog>
  )
}

export const MarkerText = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute max-w-xs -translate-x-1/2 left-1/2">
      <div className="mt-1 leading-4 text-center min-w-max px-0.5 rounded backdrop-blur-sm bg-white/50">
        {children}
      </div>
    </div>
  )
}
