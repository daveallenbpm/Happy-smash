define([], function(){
    var enemy;
    var initialSpriteXVel = -100;

    return function(game){
        enemy = game.add.sprite(game.world.width - 100, game.world.height - 300, 'sadsprite');
        enemy.scale.setTo(4, 4);

        // Enable physics on the enemy
        game.physics.arcade.enable(enemy);
        enemy.body.gravity.y = 300;
        enemy.body.collideWorldBounds = true;
        enemy.body.bounce.y = 1;
        enemy.body.bounce.x = 1;
        enemy.body.setSize(8, 12, -20, -6);

        // Add the animations, corresponding to left and right movement
        enemy.animations.add('left', [0, 1, 2, 3, 4, 5, 6], 5, true);
        enemy.animations.add('right', [7, 8, 9, 10, 11, 12, 13], 5, true);

        // Start the animation playing right
        enemy.animations.play('left');
        enemy.body.velocity.x = initialSpriteXVel;
        enemy.scoreValue = 100;
        enemy.updateMovement = updateMovement;

        return enemy;
    };

    function updateMovement() {
        var animationType = enemy.body.velocity.x < 0 ? 'left' : 'right';
        enemy.animations.play(animationType);
    }
});
