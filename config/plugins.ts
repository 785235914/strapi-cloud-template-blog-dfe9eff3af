


//// path: ./config/plugins.js

export default ({ env }) => ({
  upload: {
    config: {
      providerOptions: {
        localServer: { maxage: 300000 },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  'cloudinary-media-library': {
    enabled: true,
    config: {
      cloudName: env('CLOUDINARY_NAME'),
      apiKey: env('CLOUDINARY_KEY'),
      encryptionKey: env('CLOUDINARY_ENC_KEY'),
    },
  },
});

// ./config/plugins.js  —— 仅本地存储
// module.exports = ({ env }) => ({
//   upload: {
//     config: {
//       // 不配置 provider => 使用默认本地存储 public/uploads
//       providerOptions: {
//         localServer: { maxage: 300000 }, // 可选：控制本地静态文件缓存头
//       },
//       actionOptions: {
//         upload: {},
//         uploadStream: {},
//         delete: {},
//       },
//     },
//   },
// });

// path: ./config/plugins.ts 或 ./config/plugins.js
// export default {
//   'cloudinary-media-library': {
//     enabled: true,
//     config: {
//       cloudName: process.env.CLOUDINARY_NAME,   // 只需要 Cloud Name
//       apiKey: process.env.CLOUDINARY_KEY,       // 只需要 API Key（Public）
//       encryptionKey: process.env.CLOUDINARY_ENC_KEY, // 必须为“32个字符”的随机字符串
//     },
//   },
// };

// // ./config/plugins.js —— 仅 Cloudinary
// module.exports = ({ env }) => ({
//   upload: {
//     config: {
//       provider: 'cloudinary',
//       providerOptions: {
//         cloud_name: env('CLOUDINARY_NAME'),
//         api_key: env('CLOUDINARY_KEY'),
//         api_secret: env('CLOUDINARY_SECRET'),

//         // 如果在公司代理网络，可加：
//         // api_proxy: env('HTTPS_PROXY') || env('HTTP_PROXY'),
//       },
//       actionOptions: {
//         upload: {},
//         uploadStream: {},
//         delete: {},
//       },
//     },
//   },
// });


// // ./strapi/config/plugins.ts
// export default ({ env }) => ({
//   'preview-button': {
//     enabled: true,
//     config: {
//       contentTypes: [
//         {
//           uid: 'api::article.article',
//           targetField: 'slug',
//           draft: {
//             // 点击“预览”按钮 -> 由前端 /api/preview 接管
//             url: `${env('PREVIEW_URL')}/api/preview?url=/article/{slug}&status=draft&secret=${env('PREVIEW_SECRET')}`,
//           },
//           published: {
//             // 已发布时的“在线查看”
//             url: `${env('PREVIEW_URL')}/article/{slug}`,
//           },
//         },          
//       ],
//     },
//   },
// });


// export default ({ env }) => ({
//   'preview-button': {
//     enabled: true,
//     config: {
//       contentTypes: [
//         {
//           uid: 'api::article.article',
//           targetField: 'slug',
//           draft: {
//             url: `${env('PREVIEW_URL')}/api/preview?type=article&slug={slug}&url=/article/{slug}&status=draft&secret=${env('PREVIEW_SECRET')}`,
//           },
//           published: {
//             url: `${env('PREVIEW_URL')}/api/preview?type=article&slug={slug}&url=/article/{slug}&status=published`,
//           },
//         },
//         {
//           uid: 'api::module.module',
//           targetField: 'slug',
//           draft: {
//             url: `${env('PREVIEW_URL')}/api/preview?type=module&slug={slug}&url=/modules/{slug}&status=draft&secret=${env('PREVIEW_SECRET')}`,
//           },
//           published: {
//             url: `${env('PREVIEW_URL')}/api/preview?type=module&slug={slug}&url=/modules/{slug}&status=published`,
//           },
//         },
//         {
//           uid: 'api::news.news',
//           targetField: 'slug',
//           draft: {
//             url: `${env('PREVIEW_URL')}/api/preview?type=news&slug={slug}&url=/news/{slug}&status=draft&secret=${env('PREVIEW_SECRET')}`,
//           },
//           published: {
//             url: `${env('PREVIEW_URL')}/api/preview?type=news&slug={slug}&url=/news/{slug}&status=published`,
//           },
//         },
//       ],
//     },
//   },
// });


// export default ({ env }) => ({
//   'preview-button': {
//     enabled: true,
//     config: {
//       contentTypes: [
//         {
//           uid: 'api::article.article',
//           targetField: 'slug',
//           draft: {
//             url: `${env('PREVIEW_URL')}/article/{slug}?state=draft&secret=${env('PREVIEW_SECRET')}`,
//           },
//           published: {
//             url: `${env('PREVIEW_URL')}/article/{slug}?state=published`,
//           },
//         },
//       ],
//     },
//   },
// });


// export default ({ env }) => ({
//   // ...existing config...
//   'preview-button': {
//     enabled: true,
//     config: {
//       contentTypes: [
//         {
//           uid: 'api::article.article',
//           targetField: 'slug',
//           draft: {
//             // url: 'http://localhost:3000/api/preview?type=article&slug={slug}',
//             url: 'http://localhost:3000/api/preview?url=/article/{slug}',
//             query: {
//               preview: true,
//             },
//           },
//           published: {
//             url: 'http://localhost:3000/article/{slug}',
//             basePath: 'articles',
//           },
//         },
//       ],
//     },
//   },
// });
