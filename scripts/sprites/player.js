define([], function(){
    var player;

    return function(game){
        var initialPlayerPosition = { x: 50, y: game.world.height - 300 };
        player = game.add.sprite(initialPlayerPosition.x, initialPlayerPosition.y, 'bigblueguy');
        player.initialPlayerPosition = initialPlayerPosition;
        player.scale.setTo(2, 2);

        // Enable physics for the player
        game.physics.arcade.enable(player);
        player.body.gravity.y = 600;
        player.body.collideWorldBounds = true;
        player.animations.add('right', [1, 2, 3, 4], 6, false);
        player.animations.add('left', [5, 6, 7, 8], 6, false);
        player.animations.add('hit-by-enemy', [9, 10, 11], 6, false);
        player.updateMovement = updatePlayerMovement;

        return player;
    };

    function updatePlayerMovement(cursors) {
        if (player.state === 'hit') {
            return;
        }

        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = cursors.left.shiftKey ? -400 : -200;
            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            if (cursors.right.shiftKey) {
                console.log("Right key!")
            }
            player.body.velocity.x = cursors.right.shiftKey ? 400 : 200;
            player.animations.play('right');
        }
        else if (cursors.up.isDown) {
            // Jump animation.
        }
        else {
            //  Stand still
            player.animations.stop();
            player.frame = 0;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down) {
            player.body.velocity.y = -350;
        }
    }
});
