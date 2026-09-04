import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),

    schema: docsSchema({
      extend: z.object({

        // GENERAL
        type: z.string().optional(),

        image: z.string().optional(),

        // EQUIPMENT
        weight: z.string().optional(),
        armor: z.number().optional(),
        attack: z.number().optional(),
        defense: z.number().optional(),
        speed: z.number().optional(),
        range: z.number().optional(),
        price: z.number().optional(),
        twoHanded: z.string().optional(),
        requirement: z.string().optional(),

        // MONSTERS
        health: z.number().optional(),
        experience: z.number().optional(),

        loot: z.array(
          z.object({
            name: z.string(),
            image: z.string().optional(),
            link: z.string().optional(),
            drop: z.string().optional(),
          })
        ).optional(),

        // EVENTS
        calendar: z.array(
          z.object({
            year: z.number(),
            start: z.string(),
            end: z.string(),
          })
        ).optional(),

        beginnerIsland: z.object({
          available: z.boolean().optional(),
          location: z.string().optional(),
          npc: z.string().optional(),
          quest: z.boolean().optional(),
          currency: z.string().optional(),

          activities: z.array(
            z.string()
          ).optional(),

          rewards: z.array(
            z.string()
          ).optional(),

          features: z.array(
            z.string()
          ).optional(),
        }).optional(),

        obtainableItems: z.array(
          z.object({
            name: z.string(),
            image: z.string().optional(),
            link: z.string().optional(),
            source: z.string().optional(),
          })
        ).optional(),

        unobtainableItems: z.array(
          z.object({
            name: z.string(),
            image: z.string().optional(),
            link: z.string().optional(),
            source: z.string().optional(),
          })
        ).optional(),

        // SOURCES
        sources: z.array(
          z.union([
            z.string(),

            z.object({
              name: z.string(),
              link: z.string(),
            }),
          ])
        ).optional(),

      }),
    }),
  }),
};
