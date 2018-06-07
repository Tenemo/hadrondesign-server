import Joi from 'joi';

export default {
    // POST /api/game/new
    newGame: {
        body: {
            size: Joi.number().integer().min(6).max(16).required(),
            seed: Joi.string().max(256),
            previousId: Joi.string().length(32).alphanum().lowercase()
        }
    },
    // PUT /api/game/:id
    winGame: {
        params: {
            id: Joi.string().length(32).alphanum().lowercase().options({ convert: false }).required()
        },
        body: {
            moves: Joi.array().items(Joi.string().length(2).alphanum()).max(5000).required(),
            playerName: Joi.string().max(16).alphanum()
        }
    }
};
