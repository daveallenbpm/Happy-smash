define([], function(){
    var Menu = function (game) {
        return {
            create: function () {
                // Show something on the screen
                this.cursors = game.input.keyboard.createCursorKeys();
            },

            update: function() {
                if (this.cursors.up.isDown){
                    game.state.start('play');
                }
            }
        };
    };

    return Menu;
});