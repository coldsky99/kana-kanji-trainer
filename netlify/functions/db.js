const { Pool } = require('@neondatabase/serverless');

// --- Utilitas Konversi Nama Kunci ---
const toCamel = (s) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

const keysToCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[toCamel(key)] = keysToCamel(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

// Fungsi ini tidak digunakan saat ini tetapi berguna untuk diketahui
const toSnake = (s) => {
    return s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Inisialisasi tabel saat fungsi di-deploy
async function init() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT,
      photo_url TEXT,
      level INT DEFAULT 1,
      xp INT DEFAULT 0,
      hiragana_mastery JSONB DEFAULT '{}'::jsonb,
      katakana_mastery JSONB DEFAULT '{}'::jsonb,
      kanji_mastery JSONB DEFAULT '{}'::jsonb,
      word_mastery JSONB DEFAULT '{}'::jsonb,
      sentence_mastery JSONB DEFAULT '{}'::jsonb,
      achievements TEXT[] DEFAULT ARRAY[]::TEXT[],
      daily_progress JSONB DEFAULT '[]'::jsonb,
      has_completed_onboarding BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await pool.end();
}

init().catch(err => console.error('Initialization failed:', err));

exports.handler = async (event) => {
  if (!process.env.DATABASE_URL) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Database URL is not configured.' }) };
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const path = event.path.replace('/api/db', '');

  try {
    // Endpoint untuk mendapatkan papan peringkat
    if (path === '/leaderboard' && event.httpMethod === 'GET') {
      const { rows } = await pool.query(
        'SELECT id, display_name, photo_url, level, xp FROM users ORDER BY level DESC, xp DESC LIMIT 10'
      );
      const leaderboardData = rows.map((row, index) => ({ ...keysToCamel(row), rank: index + 1 }));
      return {
        statusCode: 200,
        body: JSON.stringify(leaderboardData),
      };
    }

    const userIdMatch = path.match(/^\/users\/(.+)/);
    if (userIdMatch) {
      const userId = userIdMatch[1];
      
      // Endpoint untuk mendapatkan data pengguna
      if (event.httpMethod === 'GET') {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (rows.length > 0) {
          return { statusCode: 200, body: JSON.stringify(keysToCamel(rows[0])) };
        }
        return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
      }
      
      // Endpoint untuk memperbarui data pengguna
      if (event.httpMethod === 'PUT') {
        const { user } = event.clientContext;
        if (!user || user.sub !== userId) {
            return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
        }

        const body = JSON.parse(event.body);
        
        const allowedUpdates = [
            'level', 'xp', 'hiraganaMastery', 'katakanaMastery', 'kanjiMastery',
            'wordMastery', 'sentenceMastery', 'achievements', 'dailyProgress',
            'hasCompletedOnboarding'
        ];

        const updates = {};
        Object.keys(body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                if (typeof body[key] === 'object' && body[key] !== null) {
                    updates[snakeKey] = JSON.stringify(body[key]);
                } else {
                    updates[snakeKey] = body[key];
                }
            }
        });

        if (Object.keys(updates).length === 0) {
            return { statusCode: 400, body: JSON.stringify({ message: 'No valid update fields provided' }) };
        }

        const setClause = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = Object.values(updates);

        const { rows } = await pool.query(
          `UPDATE users SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
          [...values, userId]
        );
        return { statusCode: 200, body: JSON.stringify(keysToCamel(rows[0])) };
      }
    }
    
    // Endpoint untuk membuat pengguna baru
    if (path === '/users' && event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const { id, email, displayName, photoURL } = body;
        
        // Coba insert, jika konflik, update email (jika berubah) dan kembalikan data yang ada
        const { rows } = await pool.query(
            `INSERT INTO users (id, email, display_name, photo_url) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (id) 
             DO UPDATE SET email = EXCLUDED.email
             RETURNING *`,
            [id, email, displayName, photoURL]
        );
        
        // Pastikan kita mendapatkan data lengkap (termasuk default)
        const { rows: finalRows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        return { statusCode: 201, body: JSON.stringify(keysToCamel(finalRows[0])) };
    }

    return { statusCode: 404, body: 'Not Found' };
  } catch (error) {
    console.error('Database Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  } finally {
    await pool.end();
  }
};