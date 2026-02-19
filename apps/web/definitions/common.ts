import * as z from 'zod';

export const IdDefinition = z.number().positive().min(1, 'Invalid ID');
export const DateDefinition = z
  .union([z.date(), z.string().refine((v) => !Number.isNaN(new Date(v).getTime()), 'Invalid date')])
  .transform((v) => (typeof v === 'string' ? new Date(v) : v));

export type Paginated<T> = z.infer<ReturnType<typeof PaginatedDefinition<z.ZodType<T>>>>;
export const PaginatedDefinition = <T extends z.ZodType>(def: T) =>
  z.object({
    data: z.array(def),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
    count: z.number(),
  });

export const Number__QueryStringDefinition = z.union([
  z
    .number()
    .optional()
    .nullable()
    .transform((v) => (v === undefined || v === null ? null : v)),
  z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (v === undefined || v === null) return null;
      const n = parseFloat(v);
      return Number.isNaN(n) ? null : n;
    }),
]);

export const NumberArray__QueryStringDefinition = z
  .array(Number__QueryStringDefinition)
  .optional()
  .nullable()
  .transform((v) => {
    if (v === undefined || v === null) return null;
    if (v.length < 1) return null;
    return v.filter((n): n is number => n !== null && n !== undefined);
  });

export const String__QueryStringDefinition = z
  .string()
  .optional()
  .nullable()
  .transform((v) => {
    if (v === undefined || v === null) return null;
    if (v.trim() === '') return null;
    return v;
  });

export const StringArray__QueryStringDefinition = z
  .array(String__QueryStringDefinition)
  .optional()
  .nullable()
  .transform((v) => {
    if (v === undefined || v === null) return null;
    if (v.length < 1) return null;
    return v.filter((s): s is string => s !== null && s !== undefined);
  });

export const Date__QueryStringDefinition = z.union([
  z
    .date()
    .optional()
    .nullable()
    .transform((v) => (v === undefined || v === null ? null : v)),
  z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (v === undefined || v === null) return null;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d;
    }),
]);
