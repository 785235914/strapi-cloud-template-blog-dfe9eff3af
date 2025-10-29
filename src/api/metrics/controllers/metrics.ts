

'use strict';

import { errors } from '@strapi/utils';
const { ValidationError, NotFoundError } = errors;

// 驼峰转下划线（viewCount -> view_count）
const toSnake = (s: string) => s.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());

// 兼容 v4/v5：统一读取模型元数据
const getMeta = (uid: string) => {
    const m1 = (strapi as any).db?.metadata?.get?.(uid);
    if (m1) return m1;
    const m2 = (strapi as any).getModel?.(uid);
    if (m2) return m2;
    return null;
};

// 取真实表名（v5: tableName；v4: collectionName）
const getTableName = (meta: any) => meta?.tableName || meta?.collectionName;

// 通用：根据属性名拿真实列名
const getColumnName = (attrs: any, prop: string) => {
    // 若 schema 指定了 columnName，优先使用
    const col = attrs?.[prop]?.columnName;
    if (col) return col;
    // 否则：如果属性名本身就是下划线（view_count），直接用它；
    //       如果是驼峰（viewCount），转换为下划线（view_count）。
    return prop.includes('_') ? prop : toSnake(prop);
};

// 自动识别统计属性名：优先 viewCount，其次 view_count
const resolveMetricProp = (attrs: any): 'viewCount' | 'view_count' => {
    if (Object.prototype.hasOwnProperty.call(attrs, 'viewCount')) return 'viewCount';
    if (Object.prototype.hasOwnProperty.call(attrs, 'view_count')) return 'view_count';
    throw new ValidationError('Target type has no "viewCount" or "view_count" field');
};

module.exports = {
    /** 通用“浏览量 +1”接口：POST /api/metrics/:uid/:id/view */
    async view(ctx) {
        const uid = String(ctx.params.uid || '').trim();   // 例如 'api::new.new'
        const id = Number(ctx.params.id);
        if (!uid || !id || Number.isNaN(id)) {
            throw new ValidationError('Invalid uid or id');
        }

        // —— 简单 bot 过滤（可按需增强） —— //
        // const ua = (ctx.request.header['user-agent'] || '').toLowerCase();

        // const ua = ('').toLowerCase();
        // if (/(bot|crawler|spider|crawling)/.test(ua)) {
        //     return ctx.send({ ok: true, skipped: true, reason: 'bot' });
        // }

        // —— 读取模型元数据 —— //
        const meta: any = getMeta(uid);
        if (!meta) throw new ValidationError(`Invalid content type uid: ${uid}`);

        const attrs = meta.attributes || {};

        // —— 自动识别统计字段名（viewCount 或 view_count） —— //
        const metricProp = resolveMetricProp(attrs);

        // —— 记录存在性校验 —— //
        const exists = await strapi.db.query(uid).findOne({
            where: { id },
            select: ['id'],
        });
        if (!exists) throw new NotFoundError('Record not found');

        // —— 解析真实表名与列名 —— //
        const tableName = getTableName(meta);
        if (!tableName) throw new ValidationError('Cannot resolve table name for model');

        // 目标计数字段的真实列名
        const metricCol = getColumnName(attrs, metricProp);

        // ✅ id 列：不要做 snake_case，除非 schema 明确自定义了 columnName
        const idCol = (attrs?.id?.columnName) || 'id';

        // —— 原子自增（Knex） —— //
        await (strapi.db as any)
            .connection(tableName)
            .where({ [idCol]: id })
            .increment(metricCol, 1);

        // —— 读回（按识别到的属性名读取） —— //
        const updated = await strapi.db.query(uid).findOne({
            where: { id },
            select: ['id', metricProp],
        });

        // 可选：为了前端兼容，也同时返回另一个别名（viewCount/view_count）
        const data: any = { id: updated?.id ?? id };
        if (metricProp === 'viewCount') {
            data.viewCount = updated?.viewCount ?? null;
            data.view_count = (updated as any)?.view_count ?? updated?.viewCount ?? null;
        } else {
            data.view_count = (updated as any)?.view_count ?? null;
            data.viewCount = updated?.viewCount ?? (updated as any)?.view_count ?? null;
        }

        ctx.send({ ok: true, data });
    },
};

// 'use strict';

// import { errors } from '@strapi/utils';
// const { ValidationError, NotFoundError } = errors;

// // 工具：驼峰转下划线（viewCount -> view_count）
// const toSnake = (s: string) => s.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());

// const convertedViewCount = toSnake('viewCount');
// console.log('view_count:', convertedViewCount);

// // 兼容 v4/v5：统一读取模型元数据
// const getMeta = (uid: string) => {
//   const m1 = (strapi as any).db?.metadata?.get?.(uid);
//   if (m1) return m1;
//   const m2 = (strapi as any).getModel?.(uid);
//   if (m2) return m2;
//   return null;
// };

// // 取真实表名（v5: tableName；v4: collectionName）
// const getTableName = (meta: any) => meta?.tableName || meta?.collectionName;

// // 通用：获取属性真实列名（优先 columnName，fallback snake_case）
// const getColumnName = (attrs: any, prop: string) =>
//   attrs?.[prop]?.columnName || toSnake(prop);

// console.log('getColumnName:', getColumnName); // view_count

// console.log('getColumnName:', getColumnName({ viewCount: { columnName: 'view_count' } }, 'viewCount')); // view_count


// module.exports = {
//   /** 专用于 viewCount +1 的通用接口 */
//   async view(ctx) {
//     const uid = String(ctx.params.uid || '').trim();   // e.g. 'api::new.new'
//     const id = Number(ctx.params.id);
//     if (!uid || !id || Number.isNaN(id)) {
//       throw new ValidationError('Invalid uid or id');
//     }

//     // —— 简单 bot 过滤（可根据需要增强） —— //
//     const ua = (ctx.request.header['user-agent'] || '').toLowerCase();
//     if (/(bot|crawler|spider|crawling)/.test(ua)) {
//       return ctx.send({ ok: true, skipped: true, reason: 'bot' });
//     }

//     // —— 读取模型元数据 —— //
//     const meta: any = getMeta(uid);
//     if (!meta) throw new ValidationError(`Invalid content type uid: ${uid}`);

//     // —— 校验存在 viewCount 属性 —— //
//     const attrs = meta.attributes || {};
//     if (!Object.prototype.hasOwnProperty.call(attrs, 'viewCount')) {
//       throw new ValidationError('Target type has no "viewCount" field');
//     }

//     // —— 记录存在性校验 —— //
//     const exists = await strapi.db.query(uid).findOne({
//       where: { id },
//       select: ['id'],
//     });
//     if (!exists) throw new NotFoundError('Record not found');

//     // —— 解析真实表名与列名 —— //
//     const tableName = getTableName(meta);
//     if (!tableName) throw new ValidationError('Cannot resolve table name for model');

//     // viewCount 的真实列名（若 schema 指定了 columnName 优先用；否则回退 view_count）
//     const viewCol = getColumnName(attrs, 'viewCount');

//     // ✅ 关键修复：id 列不要 snake_case，除非 schema 明确自定义了 columnName
//     const idCol = (attrs?.id?.columnName) || 'id';

//     // —— 原子自增（Knex） —— //
//     const qb = (strapi.db as any).connection(tableName)
//       .where({ [idCol]: id })
//       .increment(viewCol, 1);

//     // 如果你的数据库驱动支持返回受影响行数，可在此做个 assert（部分驱动无返回）
//     await qb;

//     // —— 读回最新值（Strapi 会把列映射回属性 viewCount） —— //
//     const updated = await strapi.db.query(uid).findOne({
//       where: { id },
//       select: ['id', 'viewCount'],
//     });

//     ctx.send({ ok: true, data: updated });
//   },
// };


// 'use strict';

// const { errors } = require('@strapi/utils');
// const { ValidationError, NotFoundError } = errors;

// module.exports = {
//     async view(ctx) {
//         const uid = String(ctx.params.uid || '').trim();  // e.g. 'api::news.news'
//         const id = Number(ctx.params.id);

//         if (!uid || !id || Number.isNaN(id)) {
//             throw new ValidationError('Invalid uid or id');
//         }

//         // —— 不再用白名单，直接依赖 viewCount 字段存在性 —— //
//         // —— 白名单：只允许你想统计的类型 —— //
//         // const ALLOW_LIST = new Set([
//         //   'api::news.news',
//         //   // 需要的话把其他模块加进来：
//         //   // 'api::module.module',
//         //   // 'api::article.article',
//         // ]);
//         // if (!ALLOW_LIST.has(uid)) {
//         //   throw new ValidationError('Content type not allowed');
//         // }

//         // —— 简单 bot 过滤（可加强） —— //
//         const ua = (ctx.request.header['user-agent'] || '').toLowerCase();
//         const isBot = /(bot|crawler|spider|crawling)/.test(ua);
//         if (isBot) {
//             return ctx.send({ ok: true, skipped: true, reason: 'bot' });
//         }

//         // 校验 schema 存在 viewCount 字段
//         const meta = strapi.db.metadata.get(uid);
//         if (!meta) {
//             throw new ValidationError('Invalid content type uid');
//         }
//         const hasViewCount = Object.prototype.hasOwnProperty.call(meta.attributes, 'view_count');
//         if (!hasViewCount) {
//             throw new ValidationError('Target type has no "view_count" field');
//         }

//         // 是否存在该记录
//         const exists = await strapi.db.query(uid).findOne({
//             where: { id },
//             select: ['id'],
//         });
//         if (!exists) {
//             throw new NotFoundError('Record not found');
//         }

//         // 原子自增（数据库层）
//         const tableName = meta.tableName; // 真实表名
//         await strapi.db.connection(tableName)
//             .where({ id })
//             .increment('view_count', 1);

//         // 读回最新值（可选）
//         const updated = await strapi.db.query(uid).findOne({
//             where: { id },
//             select: ['id', 'view_count'],
//         });

//         ctx.send({ ok: true, data: updated });
//     },
// };