define([], function () {
    var initial_sprite_x_vel, cursors;

    initial_sprite_x_vel = -100;

    var Play = function (game) {
        return {
            create: function () {
                var play = this;
                game.physics.startSystem(Phaser.Physics.ARCADE);
                cursors = game.input.keyboard.createCursorKeys();
                play.music = game.add.audio('soundtrack');
                play.music.play('', 0, 0, true);
                play.hit = game.add.audio('hit');


                play.background = game.add.sprite(0, 0, 'background');
                play.background.scale.setTo(1.5, 1.5);
                play.platforms = game.add.group();
                play.platforms.enableBody = true;
                var ground = this.platforms.create(0, game.world.height - 100, 'ground');

                //  This stops it from falling away when you jump on it
                ground.body.immovable = true;

                // Set the score
                play.score = 0;
                play.scoreText = game.add.text(16, 16, 'Score: ' + this.score, { fontSize: '32px', fill: '#000', fontFamily: "cursive" });

                play.sad_sprite = game.add.sprite(game.world.width - 100, game.world.height - 300, 'sadsprite');
                play.sad_sprite.scale.setTo(4, 4);

                //  We need to enable physics on the player
                game.physics.arcade.enable(this.sad_sprite);
                play.sad_sprite.body.gravity.y = 300;
                play.sad_sprite.body.collideWorldBounds = true;
                play.sad_sprite.body.bounce.y = 1;
                play.sad_sprite.body.bounce.x = 1;
                play.sad_sprite.body.setSize(8, 12, -20, -6);

                //  Our two animations, walking left and right.
                play.sad_sprite.animations.add('left', [0, 1, 2, 3, 4, 5, 6], 5, true);
                play.sad_sprite.animations.add('right', [7, 8, 9, 10, 11, 12, 13], 5, true);

                // Start the animation playing right
                play.sad_sprite.animations.play('right');
                play.sad_sprite.body.velocity.x = initial_sprite_x_vel;
                play.sad_sprite.scoreValue = 100;

                var initialPlayerPosition = { x: 50, y: game.world.height - 300 };
                play.player = game.add.sprite(initialPlayerPosition.x, initialPlayerPosition.y, 'bigblueguy');
                play.player.initialPlayerPosition = initialPlayerPosition;
                play.player.scale.setTo(2, 2);
                game.physics.arcade.enable(play.player);
                play.player.body.gravity.y = 600;
                play.player.body.collideWorldBounds = true;
                play.player.animations.add('right', [1, 2, 3, 4], 6, false);
                play.player.animations.add('left', [5, 6, 7, 8], 6, false);
                play.player.animations.add('hit-by-enemy', [9, 10, 11], 6, false);

                play.emitter = game.add.emitter(0, 0, 200);
                play.emitter.makeParticles('pixel');
                play.emitter.gravity = 0;
                play.emitter.minParticleSpeed.setTo(-200, -200);
                play.emitter.maxParticleSpeed.setTo(200, 200);
            },

            update: function () {
                var play = this;
                play.player.body.velocity.x = 0;
                game.physics.arcade.collide(play.sad_sprite, play.platforms);
                game.physics.arcade.collide(play.player, play.platforms);
                game.physics.arcade.collide(play.player, play.sad_sprite, play.playerEnemyCallback.bind(play));
                updateEnemyAnimation(play.sad_sprite);
                updatePlayerAnimation(play.player);
            },

            playerEnemyCallback: function (player, enemy) {
                var play = this;

                if (player.state === 'hit') {
                    // Don't want to repeat the action.
                    return;
                }

                var isPlayerHurt = player.body.touching.left || player.body.touching.right || player.body.touching.up;
                if (isPlayerHurt) {
                    player.animations.play('hit-by-enemy');
                    player.state = 'hit';

                    play.emitter.x = player.x + player.width / 2;
                    play.emitter.y = player.y + player.height / 2;
                    play.emitter.start(true, 300, null, 8);

                    window.setTimeout(function () {
                        player.state = 'normal';
                        player.body.x = player.initialPlayerPosition.x;
                        player.body.y = player.initialPlayerPosition.y;
                    }, 1000);
                }
                else {
                    play.emitter.x = enemy.x + enemy.width / 2;
                    play.emitter.y = enemy.y + enemy.height / 2;
                    play.score += enemy.scoreValue;

                    enemy.kill();
                    play.emitter.start(true, 300, null, 8);
                    play.scoreText.text = "Score: " + play.score;
                }

                play.hit.play('', 0, 0.5, false);
            }
        }
    };

    function updateEnemyAnimation(sprite) {
        var animationType = sprite.body.velocity.x < 0 ? 'left' : 'right';
        sprite.animations.play(animationType);
    }

    function updatePlayerAnimation(player) {
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

    return Play;
});
