import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // site/base 通过环境变量注入（GitHub Actions 会自动传入）
  // 本地开发时使用下面的默认值，部署到自定义域名时请替换
  site: process.env.ASTRO_SITE ?? 'https://yeccat-blog.example.com',
  base: process.env.ASTRO_BASE ?? '/',
  integrations: [sitemap(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
