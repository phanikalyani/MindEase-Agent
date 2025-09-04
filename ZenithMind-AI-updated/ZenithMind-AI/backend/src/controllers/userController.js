import { pool } from '../config/db.js';
import Joi from 'joi';

export async function upsertUser(req, res) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    descopeUserId: Joi.string().min(1).required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { name, email, descopeUserId } = value;
  const existing = await pool.query('SELECT user_id FROM users WHERE descope_user_id=$1', [descopeUserId]);
  let userId;
  if (existing.rowCount) {
    userId = existing.rows[0].user_id;
    await pool.query('UPDATE users SET name=$1, email=$2 WHERE user_id=$3', [name, email, userId]);
  } else {
    const ins = await pool.query(
      'INSERT INTO users (name, email, descope_user_id) VALUES ($1,$2,$3) RETURNING user_id',
      [name, email, descopeUserId]
    );
    userId = ins.rows[0].user_id;
    await pool.query('INSERT INTO preferences (user_id) VALUES ($1)', [userId]);
  }
  res.json({ userId });
}
