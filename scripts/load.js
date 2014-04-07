/* Module that loads all the resources.
 *
 * After loading, it delegates to the main game state.
 */

define([], function(){
    var Load = function (game) {
        return {
            preload: function () {
                game.load.image('background', 'assets/sunnybackground.png');
                game.load.spritesheet('sadsprite', 'assets/sadsprite.png', 16, 16);
                game.load.image('ground', 'assets/ground.png');
                game.load.spritesheet('bigblueguy', 'assets/bigblueguy.png', 50, 50);
                game.load.audio('soundtrack', ['assets/audio/soundtrack.mp3']);
                game.load.audio('hit', ['assets/audio/soundeffects/hit.wav'])
                game.load.image('pixel', 'assets/pixel.png');
            },

            create: function () {
                game.state.start('main');
            }
        };
    };

    return Load;
});