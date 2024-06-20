const Joi = require('joi');

class Validator {
    async validateCreatePoll(userData) {
        const schema = Joi.object({
            question: Joi.string().max(250).min(1),
            options: Joi.array().items(Joi.object({
                answers: Joi.string().max(50).min(1)
            }))
        });

        try {
            return await schema.validateAsync(userData);
        } catch (error) {
            throw error;
        }
    }

    async validateUserSignup(userData) {
        const schema = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(30)
                .required(),
            fullname: Joi.string().min(3).max(25),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.string().valid(Joi.ref('password')).required(),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }).required(),
        });

        try {
            return await schema.validateAsync(userData);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new Validator();
