import Joi from 'joi';

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(2000).required()
});

export async function submitContact(req, res) {
  const { error } = contactSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  // For now, just acknowledge; later we can email or store
  res.json({ ok: true });
}


