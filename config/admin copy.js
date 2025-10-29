

// // import { env } from '@strapi/utils';

// // 工具函数：根据内容类型生成页面路径
// const getPreviewPathname = (uid: string, { locale, document, clientUrl }: any): string => {
//   const { slug } = document;
//   switch (uid) {
//     case 'api::page.page':
//       switch (slug) {
//         case 'homepage':
//           return clientUrl || '/'; // 从环境变量读取首页地址
//         // return '/' // 首页
//         // return `/${locale || ''}`.replace(/\/$/, '') || '/';
//         case 'pricing': return '/pricing';
//         case 'contact': return '/contact';
//         case 'faq': return '/faq';
//         default: return `/${slug}`;
//       }
//     case 'api::product.product':
//       return slug ? `/products/${slug}` : '/products';
//     case 'api::article.article':
//       return slug ? `/article/${slug}` : '/article';
//     case 'api::module.module':
//       return slug ? `/module/${slug}` : '/module';
//     case 'api::new.new':
//       // 前端路由是 /new/[slug]，API 是 /api/news（注意复数仅用于 API）
//       return slug ? `/new/${slug}` : '/new';
//     default:
//       return '/404';
//   }
// };

// export default ({ env }) => {
//   const clientUrl = env('CLIENT_URL');     // http://localhost:3000
//   const previewSecret = env('PREVIEW_SECRET');
//   const previewUrl = env('PREVIEW_URL');   // http://localhost:3000

//   return {
//     auth: {
//       secret: env('ADMIN_JWT_SECRET'),
//     },
//     apiToken: { salt: env('API_TOKEN_SALT') },
//     transfer: { token: { salt: env('TRANSFER_TOKEN_SALT') } },
//     secrets: { encryptionKey: env('ENCRYPTION_KEY') },
//     flags: {
//       nps: env.bool('FLAG_NPS', true),
//       promoteEE: env.bool('FLAG_PROMOTE_EE', true),
//     },
//     preview: {
//       enabled: true,
//       config: {
//         allowedOrigins: clientUrl,
//         async handler(uid, { documentId, status, clientUrl }) {
//           try {
//             const document = await strapi.documents(uid).findOne({ documentId });
//             const pathname = getPreviewPathname(uid, { document, clientUrl });

//             const urlSearchParams = new URLSearchParams({
//               url: pathname,               // 让 Nuxt 的 /api/preview 使用该路径重定向
//               secret: previewSecret,       // 预览密钥
//               status: status || 'draft',   // draft/published
//               // type: uid.split('.').pop() || '', // 例如 'article'|'module'|'news'
//               type: uid.split('.').pop() || 'homepage',
//               slug: document?.slug || '',
//             });

//             const finalUrl = `${previewUrl}/api/preview?${urlSearchParams}`;
//             strapi.log.info('[OpenPreview] return ' + finalUrl);
//             // 关键点：让前端的 server route 设置 Cookie 再跳实际页
//             return `${previewUrl}/api/preview?${urlSearchParams}`;
//           } catch (error) {
//             strapi.log.error('Preview handler error:', error);
//             return `${previewUrl}/error`;
//           }
//         },
//       },
//     },
//   };
// };

