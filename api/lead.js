'use strict';

// Vercel serverless function — POST /api/lead
// API-ключ Aspro хранится в переменной окружения ASPRO_API_KEY (Vercel dashboard)

module.exports = async function handler(req, res) {
    // CORS — разрешаем только с нашего домена
    res.setHeader('Access-Control-Allow-Origin', 'https://dvzh.tech');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST')  return res.status(405).json({ error: 'Method not allowed' });

    const { name, phone, source, utm, page } = req.body || {};

    // Валидация на сервере
    if (!name || String(name).trim().length < 2)
        return res.status(400).json({ error: 'Введите имя (минимум 2 символа)' });
    if (!phone || String(phone).trim().length < 5)
        return res.status(400).json({ error: 'Введите номер телефона' });

    const apiKey = process.env.ASPRO_API_KEY;
    if (!apiKey) {
        console.error('[lead] ASPRO_API_KEY не задан');
        return res.status(500).json({ error: 'Ошибка конфигурации сервера. Позвоните нам.' });
    }

    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const description = [
        'Заявка с лендинга НейроФуд',
        'Дата: ' + now,
        page   ? 'Страница: '  + page   : null,
        source ? 'Источник: '  + source : null,
        utm    ? 'UTM: '       + utm    : null,
    ].filter(Boolean).join(' | ');

    const body = new URLSearchParams({
        name:          String(name).trim(),
        contact_name:  String(name).trim(),
        contact_phone: String(phone).trim(),
        manager_id:    '413955',
        pipeline_id:   '2',
        source_id:     '4',
        description:   description,
    });

    try {
        const upstream = await fetch(
            'https://dvzh.aspro.cloud/api/v1/module/crm/lead/create?api_key=' + encodeURIComponent(apiKey),
            {
                method:  'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body:    body.toString(),
            }
        );

        let data = {};
        try { data = await upstream.json(); } catch (_) { /* non-JSON body */ }

        if (upstream.ok && !data.error) {
            return res.status(200).json({ success: true });
        }

        console.error('[lead] Aspro error', upstream.status, JSON.stringify(data));
        return res.status(502).json({
            error: 'Не удалось создать заявку. Попробуйте ещё раз или позвоните нам.',
        });

    } catch (err) {
        console.error('[lead] fetch error', err);
        return res.status(500).json({ error: 'Ошибка сети. Попробуйте ещё раз.' });
    }
};
