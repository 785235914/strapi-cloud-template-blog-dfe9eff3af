'use strict';

const { errors } = require('@strapi/utils');
const { NotFoundError, ValidationError } = errors;

module.exports = {
  async view(ctx) {
    const id = Number(ctx.params.id);
    if (!id || Number.isNaN(id)) {
      throw new ValidationError('Invalid news id');
    }

    // 简单机器人过滤（可选）
    const ua = (ctx.request.header['user-agent'] || '').toLowerCase();
    const isBot = /(bot|crawler|spider|crawling)/.test(ua);
    if (isBot) {
      return ctx.send({ ok: true, skipped: true, reason: 'bot' });
    }

    // 获取真实表名（不同项目表名可能含前缀）
    const meta = strapi.db.metadata.get('api::news.news');
    const tableName = meta.tableName; // e.g. 'news' 或 'news_articles'

    // 先检查是否存在
    const exists = await strapi.db.query('api::news.news').findOne({
      where: { id },
      select: ['id'],
    });
    if (!exists) {
      throw new NotFoundError('News not found');
    }

    // —— 数据库层原子自增 —— //
    await strapi.db.connection(tableName)
      .where({ id })
      .increment('view_count', 1);

    // 可选：读回最新值
    const updated = await strapi.db.query('api::news.news').findOne({
      where: { id },
      select: ['id', 'view_count'],
    });

    ctx.send({ ok: true, data: updated });
  },
};