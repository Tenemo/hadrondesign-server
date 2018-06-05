import _ from 'lodash';
import express from 'express';
import gameController from '../controllers/game.controller';

const router = express.Router();

gameController.newGame();

let _game = [];

router.route('/')
    /* Create */
    .post((req, res) => {
        _game.push(req.body);
        res.json({info: 'game created successfully'});
    })
    /* Read */
    .get((req, res) => {
        res.send(_game);
    });
router.route('/:id')
    .get((res, req) => {
        res.send(
            _.find(
                _game,
                {
                    gameID: req.params.id
                }
            )
        );
    })
    /* Update */
    .put((req, res) => {
        let index = _.findIndex(
            _game,
            {
                gameID: req.params.id
            }
        );
        _.merge(_game[index], req.body);
        res.json({info: 'game updated successfully'});
    })
    /* Delete */
    .delete((req, res) => {
        _.remove(_game, (game) => {
            return game.gameID === req.params.id;
        });
        res.json({info: 'game removed successfully'});
    });

export default router;