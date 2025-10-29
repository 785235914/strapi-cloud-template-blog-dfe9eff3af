// src/index.ts
import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {

      const types = Object.keys(strapi.contentTypes || {})
      console.log('[content types]', types)

      const router: any = (strapi.server as any)?.router;
      const list: any[] =
        (router && typeof router.routes === 'function' ? router.routes() : []) || [];

      const metricsRoutes = list
        .filter((r: any) => String(r.path || '').includes('metrics'))
        .map((r: any) => {
          const methods = Array.isArray(r.methods) ? r.methods.join(',') : String(r.methods || '');
          return `${methods.padEnd(10)} ${r.path}`;
        });

      console.log('[metrics routes registered]');
      if (metricsRoutes.length === 0) {
        console.log('  (no metrics routes found)');
      } else {
        metricsRoutes.forEach((line) => console.log('  ', line));
      }
    } catch (e: any) {
      console.warn('[metrics routes] cannot inspect router:', e?.message || e);
    }
  },
};