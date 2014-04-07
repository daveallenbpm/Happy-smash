define(['load', 'play'], function (Load, Play) {
    "use strict";
    var game;

    requirejs.config({
        //By default load any module IDs from js/lib
        baseUrl: '../../scripts',
        paths: {
            underscore: '../bower_components/underscore/underscore'
        }
    });

    game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game-div');

    game.state.add('load', Load(game));
    game.state.add('main', Play(game));
    game.state.start('load');
});