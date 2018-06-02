export default (sequelize, DataType) => {
    const game = sequelize.define('game', {
        game_id: {
            type: DataType.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }, game_player_name: {
            type: DataType.STRING(32)
        }, game_size: {
            type: DataType.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }, game_move_count: {
            type: DataType.INTEGER
        }, game_moves: {
            type: DataType.TEXT
        }, game_start_time: {
            type: DataType.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }, game_end_time: {
            type: DataType.DATE
        }, game_seed: {
            type: DataType.STRING(256),
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }, game_hash: {
            type: DataType.CHAR(32),
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        }
    },
        { freezeTableName: true }
    );
    return game;
};