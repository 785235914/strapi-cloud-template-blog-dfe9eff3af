'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/news/:id/view',
      handler: 'news.view',   // 指向下面控制器的 action
      config: {
        auth: false,          // 若需要登录后计数可改为 true 并加 policy
        policies: [],
        middlewares: [],
      },
    },
  ],
};