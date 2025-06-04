import { z } from "zod/v4";

export const StashPerformerSchema = z.object({
  custom_fields: z.object(),
  id: z.coerce.number(),
  image_path: z.string(),
  name: z.string(),
});

export type StashPerformer = z.infer<typeof StashPerformerSchema>;

export const StashFindPerformersResultSchema = z.object({
  findPerformers: z.object({
    count: z.number().positive(),
    performers: z.array(z.object({ ...StashPerformerSchema.shape })),
  }),
});

export type StashFindPerformersResultType = z.infer<
  typeof StashFindPerformersResultSchema
>;
