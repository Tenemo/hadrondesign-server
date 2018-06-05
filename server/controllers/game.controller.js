import httpStatus from 'http-status';
import db from '../../config/sequelize';
import generate from './game/generate';

export function newGame() {
    console.log(generate(12));
}

export default { newGame };