import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.coerce.date(),
    modDatetime: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // 兼容 frontmatter 中 `tags:`（YAML 解析为 null）等情况，统一兜底为空数组
    tags: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string())),
    cover: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { blog };
