<<<<<<< HEAD
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  putItem,
  getItem,
  updateItem,
  scanTable,
  queryGSI,
  generateId,
  Keys,
  GSIKeys,
} from '../config/dynamoClient.js';
=======
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

<<<<<<< HEAD
    // Check existing user by email
    const existingUsers = await queryGSI('GSI1', `USER_EMAIL#${email.toLowerCase()}`);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const id = generateId();
    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      ...Keys.user(id),
      ...GSIKeys.userEmail(email, id),
      type: 'user',
      id,
      name,
      email,
      phone: phone || null,
      password_hash: passwordHash,
      role: 'user',
      created_at: now,
      updated_at: now,
    };

    await putItem(user);

    const token = jwt.sign(
      { id, name, email, role: 'user' },
=======
    // Check existing user
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, name, email, phone, role, created_at`,
      [name, email, phone || null, passwordHash]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

<<<<<<< HEAD
    res.status(201).json({
      user: { id, name, email, phone: phone || null, role: 'user', created_at: now },
      token,
    });
  } catch (err) {
    next(err);
  }
};
=======
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

<<<<<<< HEAD
    // Find user by email via GSI1
    const users = await queryGSI('GSI1', `USER_EMAIL#${email.toLowerCase()}`);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
=======
    const result = await pool.query(
      'SELECT id, name, email, phone, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const key = Keys.user(req.user.id);
    const user = await getItem(key.PK, key.SK);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
      },
    });
=======
    const result = await pool.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: result.rows[0] });
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
<<<<<<< HEAD
    const key = Keys.user(req.user.id);
    const now = new Date().toISOString();

    const updates = { updated_at: now };
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    const updated = await updateItem(key.PK, key.SK, updates);

    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        created_at: updated.created_at,
      },
    });
=======
    const result = await pool.query(
      `UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone)
       WHERE id = $3
       RETURNING id, name, email, phone, role, created_at`,
      [name || null, phone || null, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: result.rows[0] });
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
<<<<<<< HEAD
    const users = await scanTable({
      filterExpression: '#type = :type',
      expressionAttributeNames: { '#type': 'type' },
      expressionAttributeValues: { ':type': 'user' },
    });

    users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        created_at: u.created_at,
      })),
    });
=======
    const result = await pool.query(
      'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either user or admin.' });
    }

<<<<<<< HEAD
    const key = Keys.user(id);
    const now = new Date().toISOString();

    const updated = await updateItem(key.PK, key.SK, { role, updated_at: now });

    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        created_at: updated.created_at,
      },
    });
=======
    const result = await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, phone, role, created_at`,
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: result.rows[0] });
>>>>>>> 45d7ce35bfbc3b7dd0cb0f34fc5c2066024c0e92
  } catch (err) {
    next(err);
  }
};
