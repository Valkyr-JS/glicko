import { z } from "zod/v4";

export const StashBoxSchema = z.object({
  endpoint: z.string(),
  name: z.string(),
});

export type StashBox = z.infer<typeof StashBoxSchema>;

export const StashGlickoCustomFields = z.object({
  glicko_deviation: z.number().positive().optional(),
  glicko_rating: z.number().positive().optional(),
  glicko_volatility: z.number().positive().optional(),
});

export const StashImageSchema = z.object({
  id: z.coerce.number(),
  paths: z.object({
    image: z.string(),
    thumbnail: z.string(),
  }),
});

export type StashImage = z.infer<typeof StashImageSchema>;

export const StashPerformerSchema = z.object({
  custom_fields: z.object({
    ...StashGlickoCustomFields.shape,
  }),
  id: z.coerce.number(),
  image_path: z.string(),
  name: z.string(),
});

export type StashPerformer = z.infer<typeof StashPerformerSchema>;

export const StashVersionSchema = z
  .object({
    version: z
      .object({
        build_time: z.string(),
        hash: z.string(),
        version: z.string(),
      })
      .partial(),
  })
  .partial();

export type StashVersionResult = z.infer<typeof StashVersionSchema>;

export const StashConfigResultSchema = z.object({
  configuration: z.object({
    general: z
      .object({
        stashBoxes: z
          .object({
            ...StashBoxSchema.shape,
          })
          .optional(),
      })
      .optional(),
  }),
});

export type StashConfigResult = z.infer<typeof StashConfigResultSchema>;

export const StashFindImagesSchema = z.object({
  findImages: z.object({
    count: z.number().positive(),
    images: z.array(z.object({ ...StashImageSchema.shape })),
  }),
});

export type StashFindImagesResult = z.infer<typeof StashFindImagesSchema>;

export const StashFindPerformersResultSchema = z.object({
  findPerformers: z.object({
    count: z.number().positive(),
    performers: z.array(z.object({ ...StashPerformerSchema.shape })),
  }),
});

export type StashFindPerformersResult = z.infer<
  typeof StashFindPerformersResultSchema
>;
