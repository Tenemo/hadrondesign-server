import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/paramValidation';
import gameController from '../controllers/game.controller';

const router = express.Router();

router.route('/new')
    /** POST /api/game/new - Initialize new game */
    .post(validate(paramValidation.newGame), gameController.newGame);

router.route('/:id')
    /* PUT /api/game/:id - Win given game */
    .put(validate(paramValidation.winGame), gameController.winGame);

export default router;