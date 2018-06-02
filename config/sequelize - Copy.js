import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import config from './config';
import { chalkSuccess, chalkProcessing, chalkError } from './chalkConfig';

let db = null;

module.exports = app => {
    if (!db) {
        const sequelize = new Sequelize(
            config.postgres.db,
            config.postgres.user,
            config.postgres.passwd,
            {
                dialect: 'postgres',
                port: config.postgres.port,
                host: config.postgres.host,
                operatorsAliases: false
            }
        );
        db = {
            sequelize,
            Sequelize,
            models: {},
        };
        const dir = path.normalize(`${__dirname}/../server/models`);
        fs.readdirSync(dir).forEach(file => {
            const modelDir = path.join(dir, file);
            const model = sequelize.import(modelDir);
            db.models[model.name] = model;
        });
        Object.keys(db.models).forEach(key => {
            db.models[key].associate(db.models);
        });
    }
    console.log('test');
    return db;
};