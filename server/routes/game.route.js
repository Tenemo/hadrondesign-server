import _ from 'lodash';

export default (app) => {

    let _game = [];

    /* Create */
    app.post('/', (req, res) => {
        _game.push(req.body);
        res.json({info: 'game created successfully'});
    });

    /* Read */
    app.get('/', (req, res) => {
        res.send(_game);
    });

    app.get('/:id', (res, req) => {
        res.send(
            _.find(
                _game,
                {
                    gameID: req.params.id
                }
            )
        );
    });

    /* Update */
    app.put('/:id', (req, res) => {
        let index = _.findIndex(
            _game,
            {
                gameID: req.params.id
            }
        );
        _.merge(_game[index], req.body);
        res.json({info: 'game updated successfully'});
    });

    /* Delete */
    app.delete('/:id', (req, res) => {
        _.remove(_game, (game) => {
            return game.gameID === req.params.id;
        });
        res.json({info: 'game removed successfully'});
    });
};
