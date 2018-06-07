import httpStatus from 'http-status';
import db from '../../config/sequelize';
import md5 from 'md5';
import generateBoard from './game/generate';
import checkMoves from './game/checkMoves';
import calculateScore from './game/score';
import { randBetween } from '../helpers/helpers';
import gameConfig from '../../config/gameConfig';

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
                game_id: req.body.previousId,
                game_isWon: false
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
 * @param {array} req.body.moves - ["A1","C5","B9","B9","B9","B9"]
 * @param {string} req.body.playerName - optional, defaults to "Anonymous"
 * @returns {boolean} - sends back isWon boolean, false should only happen in extreme cases
 * @returns {number} - sends back score
 */
function winGame(req, res, next) {
    Game.findOne({ where: { game_id: req.params.id } })
        .then((game) => {
            if (!game) {
                const err = new Error('Game doesn\'t exist');
                err.status = httpStatus.NOT_FOUND;
                return next(err);
            }
            // if (game.game_isWon === true) {
            //     res.send([game.game_isWon, game.game_score]);
            //     return;
            // }
            game.game_moves = req.body.moves.toString();
            const isWon = checkMoves(game);
            if (!isWon) {
                const err = new Error('Provided moves are either illegal or don\'t result in a win');
                err.status = httpStatus.BAD_REQUEST;
                return next(err);
            }
            game.game_player_name = req.body.playerName;
            game.game_end_time = Date.now();
            game.game_move_count = req.body.moves.length;
            game.game_isWon = isWon;
            game.game_score = calculateScore(game);
            return game.save()
                .then(() => { return res.send([isWon, game.game_score]); })
                .catch(err => next(err));
        })
        .catch(err => next(err));
}

function highScores(req, res, next) {
    Game.findAll({
        limit: 20,
        where: {
            game_isWon: true,
            game_isSeedCustom: false
        },
        order: [
            ['game_score', 'DESC']
        ],
        attributes: ['game_score', 'game_player_name', 'game_size']
    })
        .then(scores => res.json(scores))
        .catch(err => next(err));

}

export function fakeData(res, req, next) {
    for (let i = 0; i < 10000; i++) {
        console.log('Preparing fake game #' + i + ' before inserting into database');
        const game = Game.create({
            game_id: md5(Date.now()),
            game_size: randBetween(gameConfig.minSize, gameConfig.maxSize),
            game_seed: (Date.now() * 2),
            game_isSeedCustom: false,
            game_isWon: true,
            game_score: randBetween(1000, 20000),
            game_player_name: md5(Date.now()).substring(0, 3),
            game_move_count: randBetween(10, 50),
            game_moves: (() => {
                let moves = [];
                let possible = 'ABCDEFGHIJKLMNOP';
                for (let j = 0; j < randBetween(10, 200); j++) {
                    let letter = possible.charAt(Math.floor(Math.random() * possible.length));
                    let number = randBetween(1, 16);
                    moves[j] = letter + number;
                }
                return moves.toString();
            })(),
            game_start_time: Date.now() - randBetween(1000, 20000),
            game_end_time: Date.now() + randBetween(1000, 20000)
        }).
        then(game => {
        })
        .catch(err => next(err));
    }
}
    // try {
    //     setTimeout(fakeData(), 10000);
    // } catch(err) {} // eslint-disable-line no-empty

    export default { newGame, winGame, highScores, fakeData };