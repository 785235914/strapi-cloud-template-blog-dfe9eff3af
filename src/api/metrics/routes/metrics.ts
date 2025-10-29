'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/metrics/:uid/:id/view',       // 前端请求 /api/metrics/<uid>/<id>/view
      handler: 'api::metrics.metrics.view',
      config: {
        auth: false,                        // 排查阶段先 false，避免权限影响
        policies: [],
        middlewares: [],
      },
    },
  ],
};

// 'use strict';

// module.exports = {
//   routes: [
//     {
//       method: 'POST',
//       path: '/metrics/:uid/:id/view',
//       handler: 'metrics.view',
//       config: {
//         auth: false,          // 如需登录后统计可改为 true 并配置 policies
//         policies: [],
//         middlewares: [],
//       },
//     },
//   ],
// };

