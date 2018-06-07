import Joi from 'joi';

export default {
    // POST /api/game/new
    newGame: {
        body: {
            size: Joi.number().integer().min(6).max(16).required(),
            seed: Joi.string().max(256),
        }
    }
};
