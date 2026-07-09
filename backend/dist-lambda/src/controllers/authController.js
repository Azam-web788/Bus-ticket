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
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      user: { id, name, email, phone: phone || null, role: 'user', created_at: now },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email via GSI1
    const users = await queryGSI('GSI1', `USER_EMAIL#${email.toLowerCase()}`);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
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
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
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
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};
