import httpStatus from 'http-status';
import db from '../../config/sequelize';
import generateBoard from './game/generate';

const Game = db.game;

/**
 * Initialize new game
 * @param {number} req.body.size - Requested size of the board
 * @param {string} req.body.seed - Optional seed for board generation
 * @returns {Object} - generated board array of tile rows
 */
function newGame(req, res, next) {
    try {
        res.send(generateBoard(req.body.size, req.body.seed).tiles);
    }
    catch(e) {
        e => res.status(500).send('Game creation error');
    }
}

export default { newGame };