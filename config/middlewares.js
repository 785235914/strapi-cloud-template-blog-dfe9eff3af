// export default [
//   'strapi::logger',
//   'strapi::errors',
//   'strapi::security',
//   'strapi::cors',
//   'strapi::poweredBy',
//   'strapi::query',
//   'strapi::body',
//   'strapi::session',
//   'strapi::favicon',
//   'strapi::public',
// ];

// export default [
//   'strapi::logger',
//   'strapi::errors',
//   {
//     name: 'strapi::security',
//     config: {
//       contentSecurityPolicy: {
//         useDefaults: true,
//         directives: {
//           'default-src': ["'self'"],
//           'img-src': ["'self'", 'data:', 'blob:', 'http://localhost:1337'],
//           'media-src': ["'self'", 'http://localhost:1337'],
//           upgradeInsecureRequests: null,
//         },
//       },
//     },
//   },
//   {
//     name: 'strapi::cors',
//     config: {
//       enabled: true,
//       origin: [process.env.CLIENT_URL || 'http://localhost:3000'],
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//       headers: ['Content-Type', 'Authorization'],
//       credentials: false,
//     },
//   },
//   'strapi::poweredBy',
//   'strapi::query',
//   'strapi::body',
//   'strapi::session',
//   'strapi::favicon',
//   'strapi::public',
// ];


export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // 总开关
          'default-src': ["'self'"],

          // 图片（Admin 里缩略图 & 预览；含 Cloudinary CDN、Marketplace 资源）
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'http://localhost:1337',           // 开发期可留；生产可移除
            'market-assets.strapi.io',
            'res.cloudinary.com'
          ],

          // 媒体（视频/音频）
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'http://localhost:1337',
            'market-assets.strapi.io',
            'res.cloudinary.com'
          ],

          // 脚本（小部件会拉取远端脚本；Admin 一般需要允许 inline）
          'script-src': [
            "'self'",
            'https:',
            "'unsafe-inline'"
          ],

          // 内嵌框架（Cloudinary Widget / 控制台嵌入/SSO）
          'frame-src': [
            "'self'",
            'https:',
            'res.cloudinary.com',
            'console.cloudinary.com'
          ],

          // XHR/Websocket 等
          'connect-src': ["'self'", 'https:'],

          // 如需在 http 开发，避免强升 https
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [process.env.CLIENT_URL || 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      // keepHeaderOnError: true,
      credentials: false,
    },
    
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];