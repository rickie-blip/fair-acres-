import Joi from "joi";

export const complaintCreateSchema = Joi.object({
  room_number: Joi.string().max(20).allow("", null).optional(),
  category: Joi.string().valid("cleaning", "bathroom", "smell", "service", "other").required(),
  description: Joi.string().min(3).max(4000).required(),
  urgency: Joi.string().valid("normal", "urgent").required(),
  images: Joi.array().items(Joi.string().uri()).max(3).optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().max(30).optional(),
  pin: Joi.string().min(4).max(12).optional(),
  password: Joi.string().min(6).max(200).optional()
}).custom((value, helpers) => {
  const { email, phone, pin, password } = value;
  const hasEmailPass = !!email && !!password;
  const hasPhonePin = !!phone && !!pin;
  if (!hasEmailPass && !hasPhonePin) return helpers.error("any.invalid");
  return value;
}, "login method");

export const taskCreateSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  department: Joi.string().min(2).max(100).required(),
  assigned_to: Joi.string().uuid().allow(null).optional(),
  frequency: Joi.string().min(2).max(30).required()
});

export const taskPatchSchema = Joi.object({
  status: Joi.string().valid("pending", "completed").optional(),
  assigned_to: Joi.string().uuid().allow(null).optional()
}).min(1);

export const complaintStatusPatchSchema = Joi.object({
  status: Joi.string().valid("new", "in_progress", "resolved").required()
});

