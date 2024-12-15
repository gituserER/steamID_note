const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(process.cwd(), 'database.json');

async function readDatabase() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { ids: [] };
    }
}

async function writeDatabase(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

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
            const data = await readDatabase();
            res.json(data);
        } else if (req.method === 'POST') {
            const { ids } = req.body;
            await writeDatabase({ ids });
            res.json({ success: true });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 