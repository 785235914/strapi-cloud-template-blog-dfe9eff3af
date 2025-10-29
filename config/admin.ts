
// ./strapi/config/admin.ts
// 参考：Strapi v5 官方 Preview 配置（需在 admin 配置里开启 preview 并实现 handler）



// 用于生成不同内容类型的前端路径
// const getPreviewPathname = (uid: string, { locale, document }: any): string => {
//   const slug = document?.slug;
//   switch (uid) {
//     case 'api::page.page':
//       if (slug === 'homepage') return `/${locale || ''}`.replace(/\/$/, '') || '/';
//       if (slug === 'pricing') return '/pricing';
//       if (slug === 'contact') return '/contact';
//       if (slug === 'faq') return '/faq';
//       return `/${slug}`;

//     case 'api::product.product':
//       return slug ? `/products/${slug}` : '/products';

//     case 'api::article.article':
//       return slug ? `/article/${slug}` : '/article';

//     default:
//       return '/404';
//   }
// };

// export default ({ env }) => {
//   const clientUrl = env('CLIENT_URL');      // http://localhost:3000
//   const previewSecret = env('PREVIEW_SECRET');
//   const previewUrl = env('PREVIEW_URL');    // http://localhost:3000

//   return {
//     auth: { secret: env('ADMIN_JWT_SECRET') },
//     apiToken: { salt: env('API_TOKEN_SALT') },
//     transfer: { token: { salt: env('TRANSFER_TOKEN_SALT') } },
//     secrets: { encryptionKey: env('ENCRYPTION_KEY') },
//     flags: {
//       nps: env.bool('FLAG_NPS', true),
//       promoteEE: env.bool('FLAG_PROMOTE_EE', true),
//     },

//     // --- Open Preview 关键配置 ---
//     preview: {
//       enabled: true,
//       config: {
//         allowedOrigins: clientUrl, // 只允许你的前端站点
//         async handler(uid, { documentId, locale, status }) {
//           // v5 使用 Document Service & documentId
//           // 并可携带 status=draft|published 获取对应版本
//           // https://docs.strapi.io/cms/api/document-service
//           const document = await strapi.documents(uid).findOne({
//             documentId,
//             locale,
//             status: status ?? 'draft',
//           });

//           const pathname = getPreviewPathname(uid, { locale, document });
//           if (!pathname) return `${previewUrl}/404`;

//           // 我们采用：跳转到 Nuxt 的 /api/preview，由它设置 cookie/参数并重定向到最终页面
//           const qs = new URLSearchParams({
//             url: pathname,             // 前端业务路径（例如 /article/my-slug）
//             secret: previewSecret,     // 保护接口
//             status: status ?? 'draft', // 传递草稿/已发
//           });

//           // ./strapi/config/admin.ts (handler 内)
//           strapi.log.info(`[OpenPreview] uid=${uid} documentId=${documentId} status=${status} locale=${locale}`);
//           const finalUrl = `${previewUrl}/api/preview?${qs.toString()}`;
//           strapi.log.info('[OpenPreview] return ' + finalUrl) 
//           return `${previewUrl}/api/preview?${qs.toString()}`;
//         },
//       },
//     },
//   };
// };



// const getPreviewPathname = (uid: string, { locale, document }: any): string => {
//   const slug = document?.slug;
//   switch (uid) {
//     case 'api::page.page':
//       if (slug === 'homepage') return `/${locale || ''}`.replace(/\/$/, '') || '/';
//       if (slug === 'pricing') return '/pricing';
//       if (slug === 'contact') return '/contact';
//       if (slug === 'faq') return '/faq';
//       return `/${slug}`;

//     case 'api::product.product':
//       return slug ? `/products/${slug}` : '/products';

//     case 'api::article.article':
//       return slug ? `/article/${slug}` : '/article';

//     case 'api::module.module':
//       return slug ? `/module/${slug}` : '/module';

//     case 'api::new.new':
//       return slug ? `/new/${slug}` : '/new';

//     default:
//       return '/404';
//   }
// };

// export default ({ env }) => {
//   const clientUrl = env('CLIENT_URL');
//   const previewSecret = env('PREVIEW_SECRET');
//   const previewUrl = env('PREVIEW_URL');

//   return {
//     auth: { secret: env('ADMIN_JWT_SECRET') },
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
//         async handler(uid, { documentId, locale, status }) {
//           const document = await strapi.documents(uid).findOne({
//             documentId,
//             locale,
//             status: status ?? 'draft',
//           });

//           const pathname = getPreviewPathname(uid, { locale, document });
//           if (!pathname) return `${previewUrl}/404`;

//           const qs = new URLSearchParams({
//             url: pathname,
//             secret: previewSecret,
//             status: status ?? 'draft',
//             type: uid.split('.').pop() || '',
//             slug: document?.slug || '',
//           });

//           const finalUrl = `${previewUrl}/api/preview?${qs.toString()}`;
//           strapi.log.info('[OpenPreview] return ' + finalUrl);
//           return finalUrl;
//         },
//       },
//     },
//   };
// };


// import { env } from '@strapi/utils';

// 工具函数：根据内容类型生成页面路径
const getPreviewPathname = (uid: string, { locale, document, clientUrl }: any): string => {
  const { slug } = document;
  switch (uid) {
    case 'api::page.page':
      switch (slug) {
        case 'homepage':
          return clientUrl || '/'; // 从环境变量读取首页地址
        // return '/' // 首页
        // return `/${locale || ''}`.replace(/\/$/, '') || '/';
        case 'pricing': return '/pricing';
        case 'contact': return '/contact';
        case 'faq': return '/faq';
        default: return `/${slug}`;
      }
    case 'api::product.product':
      return slug ? `/products/${slug}` : '/products';
    case 'api::article.article':
      return slug ? `/article/${slug}` : '/article';
    case 'api::module.module':
      return slug ? `/module/${slug}` : '/module';
    case 'api::new.new':
      // 前端路由是 /new/[slug]，API 是 /api/news（注意复数仅用于 API）
      return slug ? `/new/${slug}` : '/new';
    default:
      return '/404';
  }
};

export default ({ env }) => {
  const clientUrl = env('CLIENT_URL');     // http://localhost:3000
  const previewSecret = env('PREVIEW_SECRET');
  const previewUrl = env('PREVIEW_URL');   // http://localhost:3000

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: { salt: env('API_TOKEN_SALT') },
    transfer: { token: { salt: env('TRANSFER_TOKEN_SALT') } },
    secrets: { encryptionKey: env('ENCRYPTION_KEY') },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: clientUrl,
        async handler(uid, { documentId, status, clientUrl }) {
          try {
            const document = await strapi.documents(uid).findOne({ documentId });
            const pathname = getPreviewPathname(uid, { document, clientUrl });

            const urlSearchParams = new URLSearchParams({
              url: pathname,               // 让 Nuxt 的 /api/preview 使用该路径重定向
              secret: previewSecret,       // 预览密钥
              status: status || 'draft',   // draft/published
              // type: uid.split('.').pop() || '', // 例如 'article'|'module'|'news'
              type: uid.split('.').pop() || 'homepage',
              slug: document?.slug || '',
            });

            const finalUrl = `${previewUrl}/api/preview?${urlSearchParams}`;
            strapi.log.info('[OpenPreview] return ' + finalUrl);
            // 关键点：让前端的 server route 设置 Cookie 再跳实际页
            return `${previewUrl}/api/preview?${urlSearchParams}`;
          } catch (error) {
            strapi.log.error('Preview handler error:', error);
            return `${previewUrl}/error`;
          }
        },
      },
    },
  };
};

