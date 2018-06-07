import gameConfig from '../../../config/gameConfig';
/**
 * Checks if moves are legal and end up in victory
 * @param {object} game
 * @return {number}
 */
function score(game) {
    const minSize = gameConfig.minSize;
    if (game.game_size < minSize || game.game_isSeedCustom) return 0;

    const moveScore = game.game_size * 4 / game.game_move_count;
    // console.log('moveScore: ' + moveScore);

    const sizeScore = 1 + ((game.game_size - minSize) * 2);
    // console.log('sizeScore: ' + sizeScore);

    const timeScore = (sizeScore * 10000)/(game.game_end_time - game.game_start_time);
    // console.log('timeScore: ' + timeScore);

    const result = moveScore * timeScore * sizeScore * 1000;
    // console.log('RESULT: ' + result);

    return Math.trunc(result);
}

export default score;