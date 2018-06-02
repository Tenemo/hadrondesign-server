import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import config from './config';
import { chalkSuccess, chalkProcessing, chalkError } from './chalkConfig';

const modelsDir = path.normalize(`${__dirname}/../server/models`);
let db = {};

// connect to postgres db
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
sequelize
    .authenticate()
    .then((err) => {
        console.log(chalkSuccess('Database connection has been established successfully.')); // eslint-disable-line no-console
    })
    .catch(err => {
        console.error(chalkError('Unable to connect to the database:', err)); // eslint-disable-line no-console
    });

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
    .filter(file => (file.indexOf('.') !== 0) && (file.indexOf('.map') === -1) && (file.slice(-3) === '.js'))
    // import model files and save model names
    .forEach((file) => {
        console.log(chalkProcessing(`Loading model file ${file}`)); // eslint-disable-line no-console
        const model = sequelize.import(path.join(modelsDir, file));
        console.log('JSON db: ' + JSON.stringify(db));
        console.log('JSON model: ' + JSON.stringify(model));
        db[model.name] = model;
        console.log('JSON db: ' + JSON.stringify(db));
        console.log('db: ' + db);
    });

// Synchronizing any model changes with database.
// sequelize.sync().then(() => {
//     console.log(chalkSuccess('Database synchronized'));
// }, (err) => {
//     console.log(chalkError('An error occured:'));
//     console.log('%j', err);
// });

sequelize
    .sync({ force: true })
    .then(() => {
        console.log(chalkSuccess('Database synchronized')); // eslint-disable-line no-console
    }).catch(err => {
        console.log(chalkError('Rolled back, an error occured:')); // eslint-disable-line no-console
        console.log(err); // eslint-disable-line no-console
    });

export default _.extend({
    sequelize,
    Sequelize,
}, db);