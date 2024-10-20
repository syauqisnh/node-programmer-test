import Joi from 'joi';

const transactionSchema = Joi.object({
    service_code: Joi.string()
        .required()
        .messages({
            'string.base': 'Service code harus berupa string',
            'any.required': 'Service code tidak boleh kosong'
        }),
});

// const historySchema = Joi.object({
//     limit: Joi.number()
//         .integer()
//         .min(0)
//         .optional()
//         .messages({
//             'number.base': 'Limit harus berupa angka',
//             'number.integer': 'Limit harus berupa angka bulat',
//             'number.min': 'Limit tidak boleh kurang dari 0'
//         }),
// });

export { transactionSchema };