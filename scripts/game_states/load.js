
define([], function(){
    var Load = function (game) {
        return {
            preload: function () {
                game.load.image('background', 'assets/sunnybackground.png');
                game.load.image('ground', 'assets/ground.png');
                game.load.image('pixel', 'assets/pixel.png');

                game.load.spritesheet('sadsprite', 'assets/sadsprite.png', 16, 16);
                game.load.spritesheet('bigblueguy', 'assets/bigblueguy.png', 50, 50);

                game.load.audio('soundtrack', ['assets/audio/soundtrack.mp3']);
                game.load.audio('hit', ['assets/audio/soundeffects/hit.wav']);
                game.load.audio('smash', ['assets/audio/soundeffects/smash.wav']);
                game.load.audio('ouch', ['assets/audio/soundeffects/ouch.wav']);
            },

            create: function () {
                game.state.start('menu');
            }
        };
    };

    return Load;
});