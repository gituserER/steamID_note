const { Redis } = require('@upstash/redis');

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = async (req, res) => {
    // Настройка CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Обработка OPTIONS запроса (для CORS)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            const ids = await redis.get('steamids') || [];
            res.json({ ids });
        } else if (req.method === 'POST') {
            const { ids } = req.body;
            await redis.set('steamids', ids);
            res.json({ success: true });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 