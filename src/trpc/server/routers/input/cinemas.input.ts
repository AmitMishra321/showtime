import { z } from 'zod'
import {
  SortOrder,
  dateTimeFilter,
  intFilter,
  locationFilter,
  stringFilter,
} from './common.input'

const cinemaOrderByWithRelationInputSchema = z.object({
  id: SortOrder,
  createdAt: SortOrder,
  updatedAt: SortOrder,
  name: SortOrder,
})

const cinemaWhereInputSchemaPrimitive = z.object({
  id: intFilter,
  name: stringFilter,
  createdAt: dateTimeFilter,
  updatedAt: dateTimeFilter,
})

const addressWhere = z.object({
  ne_lng: z.number(),
  ne_lat: z.number(),
  sw_lng: z.number(),
  sw_lat: z.number(),
})

export const cinemaWhereInputSchema = z.union([
  cinemaWhereInputSchemaPrimitive,

  z.object({
    AND: z.array(cinemaWhereInputSchemaPrimitive).optional(),
    OR: z.array(cinemaWhereInputSchemaPrimitive).optional(),
    NOT: z.array(cinemaWhereInputSchemaPrimitive).optional(),
  }),
])

const cinemaWhereUniqueInputSchema = z.object({
  id: z.number(),
})

export const findManyCinemaArgsSchema = z.object({
  where: cinemaWhereInputSchema.optional(),
  orderBy: z.array(cinemaOrderByWithRelationInputSchema).optional(),
  cursor: cinemaWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(z.enum(['id'])).optional(),
  locationFilter,
})

export const cinemaScalarFieldEnumSchema = z.enum(['id'])
