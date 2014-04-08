define(['load', 'menu', 'play', 'config'], function (Load, Menu, Play, config) {
    "use strict";
    var game = new Phaser.Game(config.width, config.height, Phaser.AUTO, 'game-div');


    game.state.add('load', Load(game));
    game.state.add('menu', Menu(game));
    game.state.add('play', Play(game));

    game.state.start('load');
});