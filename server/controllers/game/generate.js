import seedrandom from 'seedrandom';

/**
 * Inserts a single cross at given coordinates, updating blankCount and flipping all adjacent potentially conflicting tiles to 2
 * @param  {object} board - Current board state
 * @param  {number} y - Row number, where 0 is the topmost one
 * @param  {number} x - Columm number, counting from the left to right
 * @returns {object} - Board with generated cross and adjacent tiles marked as conflicting
 */
function generateCross(board, y, x) {
    board.tiles[y][x] = 1;
    board.blankCount--;

    // checks if side squares were actually generated or were outside board bounds
    // decrements the counter for each square generated and flips tiles to 1
    if (y - 1 > -1) {
        if (board.tiles[y - 1][x] === 0) board.blankCount--;
        board.tiles[y - 1][x] = 1;
    }
    if (x - 1 > -1) {
        if (board.tiles[y][x - 1] === 0) board.blankCount--;
        board.tiles[y][x - 1] = 1;
    }
    if (y + 1 < board.size) {
        if (board.tiles[y + 1][x] === 0) board.blankCount--;
        board.tiles[y + 1][x] = 1;
    }
    if (x + 1 < board.size) {
        if (board.tiles[y][x + 1] === 0) board.blankCount--;
        board.tiles[y][x + 1] = 1;
    }

    // changes surrounding, potentially conflicting, tiles to 2's
    // it works great but i forgot how half an hour after writing and debugging this
    for (let i = -1; i < 2; i += 2) {
        if (y + i > -1 && y + i < board.size && x + i > -1 && x + i < board.size) {
            if (board.tiles[y + i][x + i] === 0) {
                board.tiles[y + i][x + i] = 2;
                board.blankCount--;
            }
        }
        if (y - i > -1 && y - i < board.size && x + i > -1 && x + i < board.size) {
            if (board.tiles[y - i][x + i] === 0) {
                board.tiles[y - i][x + i] = 2;
                board.blankCount--;
            }
        }
    }
    for (let j = -2; j < 3; j += 4) {
        if (x + j > -1 && x + j < board.size) {
            if (board.tiles[y][x + j] === 0) {
                board.tiles[y][x + j] = 2;
                board.blankCount--;
            }
        }
        if (y + j > -1 && y + j < board.size) {
            if (board.tiles[y + j][x] === 0) {
                board.tiles[y + j][x] = 2;
                board.blankCount--;
            }
        }
    }
    return board;
}

/**
 * Progresses board generation by a single step, safely generating a single cross in a random position not coliding with other ones
 * @param {object} board - Current board state.
 * @returns {object} - Board progressed by one step, if there are any safe 0 tiles
 */
function nextStep(board) {
    let randN = Math.floor(Math.random() * board.blankCount) + 1;
    let y = 0;
    let x = 0;
    let i = 0;
    if (randN !== 1 || board.tiles[0][0] !== 0) {
        // iterating over board tiles, looking for a free spot
        do {
            if (board.tiles[y][x] === 0) {
                i++;
            }
            if (i == randN) {
                board = generateCross(board, y, x);
            }
            if (x == board.size - 1) {
                x = 0;
                y++;
            } else {
                x++;
            }
        } while (i < randN);
    } else {
        board = generateCross(board, y, x);
    }
    return board;
}

/**
 * Insert hardcoded mix-ins into the board
 * @param {object} board - Current board state, preferably empty
 * @returns {object} - Board updated with mix-ins
 */
function mixIns(board) {
    const mix1 = [
        [0, 0, 2, 2, 0, 0],
        [0, 2, 1, 1, 2, 0],
        [2, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 2],
        [0, 2, 1, 1, 2, 0],
        [0, 0, 2, 2, 0, 0]
    ];

    let randMixY = Math.floor(Math.random() * (board.size - mix1.length + 3));
    let randMixX = Math.floor(Math.random() * (board.size - mix1.length + 3));

    // iterating over mix-in, flipping safe-to-flip tiles, so the output tiles are solvable
    for (let i = 0; i < mix1.length; i++) {
        for (let j = 0; j < mix1[i].length; j++) {
            if (randMixY + i - 1 > -1 && randMixY + i - 1 < board.size && randMixX + j - 1 > -1 && randMixX + j - 1 < board.size) {
                board.tiles[randMixY + i - 1][randMixX + j - 1] = mix1[i][j];
                if (mix1[i][j] !== 0) board.blankCount--;
            }
        }
    }
    return board;
}

/**
 * Responsible for generating boards
 * @param {number} size - Requested size of a new board
 * @param {string} seed - Optional seed for board generation, current date by default
 * @returns {object} - Generated board
 */
function generate(size, seed = Date.now()) {

    /**
     * Main board object, containing current game state
     * @property {number} size - Board size
     * @property {array} tiles - Current board state, where 0 - blank and safe to become center tiles, 1 - flipped tile, 2 - blank conflicting (bordering a cross) tile
     * @property {number} blankCount - Number of left nonconflicting tiles, for safe generation purposes
     */
    let board = {
        size: size,
        tiles: [],
        blankCount: size * size,
        seed : seed
    };

    // setting board.tiles array size and filling it with blanks, 0's
    for (let i = 0; i < size; i++) {
        board.tiles[i] = [];
        for (let j = 0; j < size; j++) {
            board.tiles[i][j] = 0;
        }
    }

    board = mixIns(board);

    while (board.blankCount > 0) {
        board = nextStep(board);
    }

    // remove blankCount property, useful only for generating the board and debugging, it's always 0 after generating
    delete board.blankCount;

    return board;
}

export default generate;