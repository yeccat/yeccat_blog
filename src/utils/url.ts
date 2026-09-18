/**
 * 为站内链接补全 Astro base 前缀。
 *
 * import.meta.env.BASE_URL 始终以 "/" 结尾：
 * - 本地开发（base: "/"）时得到 "/"
 * - 部署到 GitHub Pages 子路径（base: "/yeccat_blog/"）时得到该前缀
 *
 * 例如 withBase('/blog/') 在子路径部署下会生成 "/yeccat_blog/blog/"，
 * 避免硬编码的绝对路径链接在线上跳转到域名根目录而 404。
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\/+/, '');
  return `${base}${clean}`;
}
