import * as z from 'zod';

export const IdDefinition = z.union([
  z.number().positive().min(1, 'Invalid ID'),
  z.coerce.number().positive().min(1, 'Invalid ID'),
]);

export const DateDefinition = z
  .union([z.date(), z.string().refine((v) => !Number.isNaN(new Date(v).getTime()), 'Invalid date')])
  .transform((v) => (typeof v === 'string' ? new Date(v) : v));

export type Paginated<T> = z.infer<ReturnType<typeof PaginatedDefinition<z.ZodType<T>>>>;
export const PaginatedDefinition = <T extends z.ZodType>(def: T) =>
  z.object({
    rows: z.array(def),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
    count: z.number(),
  });

export type FailedHttpResponse = z.infer<typeof FailedHttpResponseDefinition>;
export const FailedHttpResponseDefinition = z.object({
  ok: z.literal(false),
  error: z.object({
    name: z.enum([
      'BadRequestError',
      'UnauthorizedError',
      'ForbiddenError',
      'NotFoundError',
      'MethodNotAllowedError',
      'RequestTimeoutError',
      'PayloadTooLargeError',
      'UriTooLongError',
      'TooManyRequestsError',
      'InternalServerError',
      'ServiceUnavailableError',
    ]),
    message: z.string(),
  }),
});

export type VoidSuccessfulHttpResponse = z.infer<typeof VoidSuccessfulHttpResponseDefinition>;
export const VoidSuccessfulHttpResponseDefinition = z.object({
  ok: z.literal(true),
});

export type SuccessfulHttpResponse = z.infer<typeof SuccessfulHttpResponseDefinition>;
export const SuccessfulHttpResponseDefinition = <T extends z.ZodType>(def: T) =>
  z.object({
    ok: z.literal(true),
    data: def,
  });

export type VoidHttpResponse = z.infer<typeof VoidHttpResponseDefinition>;
export const VoidHttpResponseDefinition = z.union([
  VoidSuccessfulHttpResponseDefinition,
  FailedHttpResponseDefinition,
]);

export type HttpResponse<T> = z.infer<ReturnType<typeof HttpResponseDefinition<z.ZodType<T>>>>;
export const HttpResponseDefinition = <T extends z.ZodType>(def: T) =>
  z.union([SuccessfulHttpResponseDefinition(def), FailedHttpResponseDefinition]);

export const Number__QueryStringDefinition = z.union([
  z
    .number()
    .optional()
    .nullable()
    .transform((v) => (v === undefined || v === null ? undefined : v)),
  z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      const n = parseFloat(v);
      return Number.isNaN(n) ? undefined : n;
    }),
]);

export const NumberArray__QueryStringDefinition = z
  .union([
    Number__QueryStringDefinition,
    z
      .array(Number__QueryStringDefinition)
      .optional()
      .nullable()
      .transform((v) => {
        if (v === undefined || v === null) return undefined;
        if (v.length < 1) return undefined;
        return v.filter((n): n is number => n !== null && n !== undefined);
      }),
  ])
  .transform((v) => {
    const l = Array.isArray(v) ? v : [v].filter((v) => v !== null && v !== undefined);
    if (l.length < 1) return undefined;
    return l;
  });

export const String__QueryStringDefinition = z
  .string()
  .optional()
  .nullable()
  .transform((v) => {
    if (v === undefined || v === null) return undefined;
    if (v.trim() === '') return undefined;
    return v;
  });

export const StringArray__QueryStringDefinition = z
  .union([
    String__QueryStringDefinition,
    z
      .array(String__QueryStringDefinition)
      .optional()
      .nullable()
      .transform((v) => {
        if (v === undefined || v === null) return undefined;
        if (v.length < 1) return undefined;
        return v.filter((s): s is string => s !== null && s !== undefined);
      }),
  ])
  .transform((v) => {
    const l = Array.isArray(v) ? v : [v].filter((v) => v !== null && v !== undefined);
    if (l.length < 1) return undefined;
    return l;
  });

export const Date__QueryStringDefinition = z.union([
  z
    .date()
    .optional()
    .nullable()
    .transform((v) => (v === undefined || v === null ? undefined : v)),
  z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? undefined : d;
    }),
]);
