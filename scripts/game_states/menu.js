define([], function(){
    var Menu = function (game) {
        var menuTextFontStyle = {font: 'bold 50px Consolas', fill: 'green'};
        var instructionTextFontStyle = {font: 'bold 30px Consolas', fill: 'green'};
        var state = 'animating';

        return {
            create: function () {
                var that = this;
                this.cursors = game.input.keyboard.createCursorKeys();
                that.background = game.add.sprite(-1200, 0, 'background');
                that.background.scale.setTo(1.5, 1.5);
            },

            update: function() {
                var that = this;

                if (this.cursors.up.isDown) {
                    game.state.start('play');
                }

                if (that.background.x < 0){
                    that.background.x += 10;
                }

                if (that.background.x >= 0 && state === 'animating'){
                    state = 'animationComplete';
                }

                if (state === 'animationComplete'){
                    that.menuText = game.add.text(430, 200, 'HAPPY SMASH', menuTextFontStyle);
                    that.instructionText = game.add.text(450, 300, 'Press up to start', instructionTextFontStyle);
                    state = 'done';
                }
            }
        };
    };

    return Menu;
});