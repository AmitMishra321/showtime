'use client'
import { FormTypeCreateCinema } from '@/forms/createCinema'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { TextArea } from '../atoms/textarea'
import { Button } from '../atoms/button'
import { trpcClient } from '@/trpc/clients/client'
import { useToast } from '../molecules/Toaster/use-toast'
import { useRouter } from 'next/navigation'
import { revalidatePath } from '@/utils/actions/revalidatePath'
import { ProjectionType, SoundSystemType } from '@prisma/client'
import { HtmlSelect } from '../atoms/select'
import { Plus, RectangleHorizontal } from 'lucide-react'
import { SimpleAccordion } from '../molecules/SimpleAccordion'
import { Square } from '../organisms/ScreenUtils'
import { Panel } from '../organisms/Map/Panel'
import { CenterOfMap, DefaultZoomControls } from '../organisms/Map/ZoomControls'
import { Map } from '@/components/organisms/Map/Map'
import { Marker } from '../organisms/Map/MapMarker'
import { SearchPlace } from '../organisms/SearchPlace'
export const CreateCinema = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useFormContext<FormTypeCreateCinema>()
  const { mutateAsync: createCinema, isPending } =
    trpcClient.cinemas.createCinema.useMutation()

  const { toast } = useToast()
  const { replace } = useRouter()
  return (
    <div className="grid grid-cols-2 gap-4">
      <form
        onSubmit={handleSubmit(async (data) => {
          console.log(data)
          const cinema = await createCinema(data)
          if (cinema) {
            reset()
            toast({ title: `Cinema ${data.cinemaName} created scuccessfully` })
            revalidatePath('admins/cinemas')
            replace('/admin/cinemas')
          }
        })}
      >
        <Label title="Cinema" error={errors.cinemaName?.message}>
          <Input placeholder="Cinema name" {...register('cinemaName')} />
        </Label>
        <Label title="Manger ID" error={errors.managerId?.message}>
          <Input placeholder="Manger ID" {...register('managerId')} />
        </Label>
        <Label title="Address" error={errors.address?.address?.message}>
          <TextArea placeholder="Address" {...register('address.address')} />
        </Label>
        <AddScreens />
        <Button type="submit" variant="destructive" loading={isPending}>
          Create Cinema
        </Button>
      </form>
      <Map>
        <MapMaker />
        <Panel position="left-top">
          <SearchPlace />
          <DefaultZoomControls>
            <CenterOfMap
              onClick={(lating) => {
                const lat = parseFloat(lating.lat.toFixed(6))
                const lng = parseFloat(lating.lng.toFixed(6))
                setValue('address.lat', lat, { shouldValidate: true })
                setValue('address.lng', lng, { shouldValidate: true })
              }}
            />
          </DefaultZoomControls>
        </Panel>
      </Map>
    </div>
  )
}

const AddScreens = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormTypeCreateCinema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `screens`,
  })

  const { screens } = useWatch<FormTypeCreateCinema>()

  return (
    <div>
      {fields.map((item, screenIndex) => (
        <SimpleAccordion title={screenIndex + 1 || '[Empty]'} key={item.id}>
          <div className={`flex justify-end my-2`}>
            <Button
              variant="link"
              size="sm"
              className="text-xs text-gray-600 underline underline-offset-2"
              onClick={() => {
                remove(screenIndex)
              }}
            >
              remove screen
            </Button>
          </div>

          <div className={`flex flex-col gap-2`}>
            <div className="grid grid-cols-2 gap-2">
              <Label
                title="Projection type"
                error={errors.screens?.[screenIndex]?.type?.toString()}
              >
                <HtmlSelect
                  placeholder="projection type"
                  {...register(`screens.${screenIndex}.projectionType`)}
                >
                  {Object.values(ProjectionType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </HtmlSelect>
              </Label>
              <Label
                title="Sound system type"
                error={errors.screens?.[screenIndex]?.type?.toString()}
              >
                <HtmlSelect
                  placeholder="sound system type"
                  {...register(`screens.${screenIndex}.soundSystemType`)}
                >
                  {Object.values(SoundSystemType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </HtmlSelect>
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Label
                title="Rows"
                error={errors.screens?.[screenIndex]?.rows?.message}
              >
                <Input
                  placeholder="Enter the name"
                  {...register(`screens.${screenIndex}.rows`, {
                    valueAsNumber: true,
                  })}
                />
              </Label>
              <Label
                title="Columns"
                error={errors.screens?.[screenIndex]?.columns?.message}
              >
                <Input
                  type="number"
                  placeholder="Enter the name"
                  {...register(`screens.${screenIndex}.columns`, {
                    valueAsNumber: true,
                  })}
                />
              </Label>
              <Label
                title="Price"
                error={errors.screens?.[screenIndex]?.price?.message}
              >
                <Input
                  type="number"
                  placeholder="Enter the price"
                  {...register(`screens.${screenIndex}.price`, {
                    valueAsNumber: true,
                  })}
                />
              </Label>
            </div>
            <Grid
              rows={screens?.[screenIndex]?.rows || 0}
              columns={screens?.[screenIndex]?.columns || 0}
            />
          </div>
        </SimpleAccordion>
      ))}
      <div>
        <Button
          className="flex items-center justify-center w-full py-2 text-xs border border-dashed"
          size="sm"
          variant="link"
          onClick={() =>
            append({
              columns: 0,
              rows: 0,
              price: 0,
              projectionType: ProjectionType.STANDARD,
              soundSystemType: SoundSystemType.DOLBY_ATOMS,
            })
          }
        >
          <Plus className="w-4 h-4" /> Add screen
        </Button>
      </div>
    </div>
  )
}

export const Grid = ({ rows, columns }: { rows: number; columns: number }) => {
  const renderRows = () => {
    const rowElements = []

    for (let i = 0; i < rows; i++) {
      const columnElements = []
      for (let j = 0; j < columns; j++) {
        columnElements.push(<Square key={`${i}-${j}`} />)
      }
      rowElements.push(
        <div key={`row-${i}`} className="flex gap-2">
          {columnElements}
        </div>,
      )
    }

    return (
      <div className="flex flex-col items-center gap-2 px-2 overflow-x-auto">
        {rowElements}
      </div>
    )
  }

  return (
    <div className="w-full ">
      {renderRows()}

      <CurvedScreen />
    </div>
  )
}

export const CurvedScreen = ({ width = 300, height = 10 }) => {
  const curveOffset = height * 0.9 // Controls the curvature of the screen

  return (
    <svg
      width={'100%'}
      className="mt-6"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={`M 0,${height} L 0,0 Q ${
          width / 2
        },${curveOffset} ${width},0 L ${width},${height} Z`}
        fill="black"
      />
    </svg>
  )
}

const MapMaker = () => {
  const { address } = useWatch<FormTypeCreateCinema>()
  const { setValue } = useFormContext<FormTypeCreateCinema>()

  return (
    <Marker
      pitchAlignment="auto"
      longitude={address?.lng || 0}
      latitude={address?.lat || 0}
      draggable
      onDragEnd={({ lngLat }) => {
        const { lat, lng } = lngLat
        setValue('address.lat', lat || 0)
        setValue('address.lng', lng || 0)
      }}
    >
      <BrandIcon />
    </Marker>
  )
}

export const BrandIcon = () => (
  <div style={{ perspective: '200px' }}>
    <RectangleHorizontal style={{ transform: 'rotateX(22deg)' }} />
  </div>
)
