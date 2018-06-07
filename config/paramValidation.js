import Joi from 'joi';
import gameConfig from './gameConfig';

export default {
    // POST /api/game/new
    newGame: {
        body: {
            size: Joi.number().integer().min(gameConfig.minSize).max(gameConfig.maxSize).required(),
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
            moves: Joi.array().items(Joi.string().alphanum().max(4)).max(5000).required(),
            playerName: Joi.string().max(16).alphanum()
        }
    }
};
