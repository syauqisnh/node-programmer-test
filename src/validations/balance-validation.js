import Joi from "joi";

const topupSchema = Joi.object({
    top_up_amount: Joi.number().greater(0).required().messages({
        'number.base': 'Top Up harus berupa angka',
        'number.greater': 'Top Up harus lebih besar dari 0',
        'any.required': 'Top Up harus diisi'
    })
});

export { topupSchema }