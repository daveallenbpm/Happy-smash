define([], function () {
    var enemy;

    return {
        add: function (game, group, config) {
            enemy = group.create(config.x, config.y, 'sadsprite');
            enemy.scale.setTo(4, 4);

            // Enable physics on the enemy
            enemy.body.gravity.y = config.gravity;
            enemy.body.collideWorldBounds = true;
            enemy.body.bounce.y = 1;
            enemy.body.bounce.x = 1;
            enemy.body.setSize(8, 12, -30, -6);
            enemy.body.updateBounds(enemy.scale.x, enemy.scale.y);


            // Add the animations, corresponding to left and right movement
            enemy.animations.add('left', [0, 1, 2, 3, 4, 5, 6], 5, true);
            enemy.animations.add('right', [7, 8, 9, 10, 11, 12, 13], 5, true);

            // Start the animation playing right
            enemy.animations.play('left');
            enemy.body.velocity.x = config.initialVelocity;
            enemy.scoreValue = 100;
            enemy.updateMovement = updateMovement;

            return enemy;
        }
    };

    function updateMovement() {
        var animationType = enemy.body.velocity.x < 0 ? 'left' : 'right';
        enemy.animations.play(animationType);
        console.log("playing: " + animationType);
    }
});
