const Joi = require('joi');

class Validator {
    async validateCreatePoll(userData) {
        const schema = Joi.object({
            question: Joi.string().max(250).min(1),
            options: Joi.array().items(Joi.object({
                answer: Joi.string().max(50).min(1)
            }))
        });

        try {
            return await schema.validateAsync(userData);
        } catch (error) {
            throw error;
        }
    }

    async validateVotePoll(userData) {
        const schema = Joi.object({
            _id: Joi.string().min(12).max(30),
            poll_id: Joi.string().min(12).max(30)
        });

        try {
            return await schema.validateAsync(userData);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new Validator();
