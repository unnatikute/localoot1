import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { User } from '../storage/models/index.js';
import { createJwt } from '../security/auth.middleware.js';

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export async function signup(req, res) {
  const { error, value } = signupSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const existing = await User.findOne({ where: { email: value.email } });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const password_hash = await bcrypt.hash(value.password, 10);
  const user = await User.create({ name: value.name, email: value.email, password_hash });
  const token = createJwt(user.id);
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
}

export async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const user = await User.findOne({ where: { email: value.email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(value.password, user.password_hash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = createJwt(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}


