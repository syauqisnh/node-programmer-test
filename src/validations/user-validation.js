import Joi from 'joi';

const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Paramter email tidak sesuai format',
    'string.empty': 'Email harus diisi',
  }),
  first_name: Joi.string().required().messages({
    'any.required': 'Nama depan harus diisi',
  }),
  last_name: Joi.string().required().messages({
    'any.required': 'Nama belakang harus diisi',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Parameter password minimal 8 karakter',
    'string.empty': 'Password harus diisi',
    'any.required': 'Password harus diisi',
  }),
  profile_image: Joi.string().uri().optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Parameter email tidak sesuai format',
      'string.empty': 'Email harus diisi',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Parameter password minimal 8 karakter',
      'string.empty': 'Password harus diisi',
      'any.required': 'Password harus diisi',
    }),
});

const updateUserSchema = Joi.object({
  first_name: Joi.string().required().messages({
    'any.required': 'Nama depan harus diisi',
    'string.empty': 'Nama depan harus diisi',
  }),
  last_name: Joi.string().required().messages({
    'any.required': 'Nama belakang harus diisi',
    'string.empty': 'Nama belakang harus diisi',
  })
});

export { userSchema, loginSchema, updateUserSchema };
