import React, { ReactNode, useEffect, useState } from 'react'
import { Button } from '../atoms/button'
import { TrashIcon } from 'lucide-react'

export interface ImageUploadProps {
  src?: Blob | MediaSource
  clearImage: () => void
  children: ReactNode
}
export const ImagePreview = ({
  src,
  clearImage,
  children,
}: ImageUploadProps) => {
  const [imageUrl, setImageurl] = useState('')

  useEffect(() => {
    if (src instanceof FileList && src.length > 0) {
      const file = src[0]
      const objecturl = URL.createObjectURL(file)
      setImageurl(objecturl)

      return () => {
        URL.revokeObjectURL(objecturl)
      }
    }
  }, [src])
  if (src) {
    return (
      <div className="grid items-center justify-center h-full max-w-sm grid-cols-1 grid-rows-1 aspect-square">
        <img
          src={imageUrl}
          alt=""
          className="object-cover w-full h-full col-start-1 row-start-1 rounded shadow"
        />
        <Button
          className="col-start-1 row-start-1 p-2 text-white bg-black/30 justify-self-center"
          onClick={clearImage}
        >
          <TrashIcon /> Clear
        </Button>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center w-full h-full  min-h-[12rem] bg-gray-100 shadow-inner">
      {children}
    </div>
  )
}
