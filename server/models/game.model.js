import Sequelize from 'sequelize';

export default (sequelize, DataType) => {
    const game = sequelize.define('game', {
        game_number: {
            type: DataType.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }, game_id: {
            type: DataType.CHAR(32),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }, game_size: {
            type: DataType.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }, game_seed: {
            type: DataType.STRING(256),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }, game_isSeedCustom: {
            type: DataType.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }, game_isWon: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                notEmpty: true
            }
        }, game_score: {
            type: DataType.INTEGER
        }, game_player_name: {
            type: DataType.STRING(32)
        }, game_move_count: {
            type: DataType.INTEGER
        }, game_moves: {
            type: DataType.TEXT
        }, game_start_time: {
            type: DataType.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            validate: {
                notEmpty: true
            }
        }, game_end_time: {
            type: DataType.DATE
        }
    },
        { freezeTableName: true }
    );
    return game;
};