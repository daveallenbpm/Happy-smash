define([], function () {
    var boss;

    return {
        add: function (game, group) {
            boss = group.create(1100, 100, 'sadsprite');
            boss.scale.setTo(12, 12);

            // Enable physics on the enemy
            boss.body.gravity.y = 350;
            boss.body.collideWorldBounds = true;
            boss.body.bounce.y = 1;
            boss.body.bounce.x = 1;
            boss.body.setSize(8, 12, -30, -6);
            boss.body.updateBounds(boss.scale.x, boss.scale.y);


            // Add the animations, corresponding to left and right movement
            boss.animations.add('left', [0, 1, 2, 3, 4, 5, 6], 5, true);
            boss.animations.add('right', [7, 8, 9, 10, 11, 12, 13], 5, true);

            // Start the animation playing right
            boss.animations.play('left');
            boss.body.velocity.x = 100;
            boss.scoreValue = 100;
            boss.updateMovement = updateMovement;

            return boss;
        }
    };

    function updateMovement() {
        var animationType = boss.body.velocity.x < 0 ? 'left' : 'right';
        boss.animations.play(animationType);
        console.log("playing: " + animationType);
    }
});
