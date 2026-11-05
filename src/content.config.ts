import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    emoji: z.string().default('💡'),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    emoji: z.string().default('🔧'),
    cover: z.string().optional(),
    status: z.enum(['idea', 'building', 'works', 'finished']).default('building'),
    tech: z.array(z.string()).default([]),
    repo: z.string().optional(),
    link: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const apps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    icon: z.string().optional(),
    appStore: z.string().optional(),
    repo: z.string().optional(),
    price: z.string().default('Free'),
    order: z.number().default(0),
    screenshots: z.array(z.string()).default([]),
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photos' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string(),
    caption: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { posts, projects, apps, photos };
