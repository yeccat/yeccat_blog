import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime());

  return rss({
    title: 'yeccat.blog',
    description: '分享技术笔记、学习心得与生活感悟。',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDatetime,
      link: `/blog/${post.id}/`,
    })),
  });
}
