import config from './config/config';
import app from './config/express';
import db from './config/sequelize'; // eslint-disable-line no-unused-vars
import { chalkSuccess } from './config/chalkConfig';

app.listen(config.port, () => {  // eslint-disable-line no-unused-vars
    console.log(chalkSuccess('Server running at http://127.0.0.1:' + config.port + ' in ' + config.env + ' environment')); // eslint-disable-line no-console
});

export default app;