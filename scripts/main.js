define(['load', 'play', 'config'], function (Load, Play, config) {
    "use strict";
    var game = new Phaser.Game(config.width, config.height, Phaser.AUTO, 'game-div');

    game.state.add('load', Load(game));
    game.state.add('main', Play(game));
    game.state.start('load');
});