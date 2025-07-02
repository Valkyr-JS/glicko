import { z } from "zod/v4";

export const StashBoxSchema = z.object({
  endpoint: z.string(),
  name: z.string(),
});

export type StashBox = z.infer<typeof StashBoxSchema>;

export const StashGlickoCustomFieldsSchema = z.object({
  glicko_deviation: z.number().min(0).optional(),
  glicko_rating: z.number().min(0).optional(),
  glicko_volatility: z.number().min(0).optional(),
  glicko_wins: z.number().min(0).optional(),
  glicko_losses: z.number().min(0).optional(),
  glicko_ties: z.number().min(0).optional(),
  glicko_match_history: z.string().optional(),
  glicko_session_history: z.string().optional(),
});

export type StashGlickoCustomFields = z.infer<
  typeof StashGlickoCustomFieldsSchema
>;

export const StashImageSchema = z.object({
  id: z.coerce.number(),
  paths: z.object({
    image: z.string(),
    thumbnail: z.string(),
  }),
});

export type StashImage = z.infer<typeof StashImageSchema>;

export const StashPerformerSchema = z.object({
  custom_fields: z
    .object({
      ...StashGlickoCustomFieldsSchema.shape,
    })
    .optional(),
  id: z.coerce.number(),
  image_path: z.string(),
  name: z.string(),
});

export type StashPerformer = z.infer<typeof StashPerformerSchema>;

export const StashPerformerUpdateInputSchema = z.object({
  id: z.coerce.number(),
  custom_fields: z.object({
    ...StashGlickoCustomFieldsSchema.shape,
  }),
});

export type StashPerformerUpdateInput = z.infer<
  typeof StashPerformerUpdateInputSchema
>;

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
    general: z.object({
      stashBoxes: z.array(
        z.object({
          ...StashBoxSchema.shape,
        })
      ),
    }),
    plugins: z.object({
      glicko: z
        .object({
          performerFilters: z.string().optional(),
          sessionHistory: z.string().optional(),
          userSettings: z.string().optional(),
        })
        .optional(),
    }),
  }),
});

export type StashConfigResult = z.infer<typeof StashConfigResultSchema>;

export const StashFindImagesSchema = z.object({
  findImages: z.object({
    count: z.number().min(0),
    images: z.array(z.object({ ...StashImageSchema.shape })),
  }),
});

export type StashFindImagesResult = z.infer<typeof StashFindImagesSchema>;

export const StashFindPerformersResultSchema = z.object({
  findPerformers: z.object({
    count: z.number().min(0),
    performers: z.array(z.object({ ...StashPerformerSchema.shape })),
  }),
});

export type StashFindPerformersResult = z.infer<
  typeof StashFindPerformersResultSchema
>;

export const StashPluginPerformerFiltersParsed = z.object({
  genders: z.array(
    z.enum([
      "MALE",
      "FEMALE",
      "TRANSGENDER_MALE",
      "TRANSGENDER_FEMALE",
      "INTERSEX",
      "NON_BINARY",
    ])
  ),
});

export const StashPluginUserSettingsParsed = z.object({
  arrowKeys: z.boolean().optional(),
  boardWidth: z.number().optional(),
  imageQuality: z.literal(["original", "thumbnail"]).optional(),
  minimalHistory: z.boolean().optional(),
  progressMaxRows: z.number().optional(),
  readOnly: z.boolean().optional(),
});

export const StashPluginConfigParsed = z.object({
  performerFilters: z.object({ ...StashPluginPerformerFiltersParsed.shape }),
  sessionHistory: z.array(z.coerce.date()),
  totalPerformers: z.number().optional(),
  userSettings: z.object({ ...StashPluginUserSettingsParsed.shape }),
});
