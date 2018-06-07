import httpStatus from 'http-status';
import db from '../../config/sequelize';
import generateBoard from './game/generate';
import md5 from 'md5';

const Game = db.game;

/**
 * - POST /api/game/new
 * - Initialize new game
 * @param {number} req.body.size - Requested size of the board
 * @param {string} req.body.seed - Optional seed for board generation
 * @param {string} req.body.previousId - Optional id of the previous game, remove it if the user didn't finish it
 * @returns {array} - sends back generated board array of tile rows
 */
function newGame(req, res, next) {
    if (req.body.previousId != null) {
        Game.destroy({
            where: {
                game_id: req.body.previousId
            }
        });
    }
    const board = generateBoard(req.body.size, req.body.seed);
    const hashString = (Date.now() + board.tiles).toString();
    const game = Game.build({
        game_id: md5(hashString),
        game_size: board.size,
        game_seed: (board.seed),
        game_isSeedCustom: (() => {
            if (req.body.seed == null) return false;
            else if (req.body.seed != null) return true;
        })(),
        isWon: false
    });
    game.save()
        .then(() => res.send(board.tiles))
        .catch(err => next(err));
}

/**
 * - PUT /api/game/:id
 * - Win given game
 * @param {string} req.params.id - game_id of the game
 * @param {string} req.body.moves - ["A1","C5","B9","B9","B9","B9"]
 * @param {string} req.body.playerName - optional, defaults to "Anonymous"
 * @returns {boolean} - sends back isWon boolean, false should only happen in extreme cases
 */
function winGame(req, res, next) {

}

export default { newGame, winGame };