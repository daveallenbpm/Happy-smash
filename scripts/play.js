define(['enemy', 'player'], function (Enemy, Player) {
    var cursors;

    var Play = function (game) {
        return {
            create: function () {
                var that = this;
                game.physics.startSystem(Phaser.Physics.ARCADE);
                cursors = game.input.keyboard.createCursorKeys();
                that.music = game.add.audio('soundtrack');
                that.music.play('', 0, 0, true);
                that.hit = game.add.audio('hit');

                that.background = game.add.sprite(0, 0, 'background');
                that.background.scale.setTo(1.5, 1.5);
                that.platforms = game.add.group();
                that.platforms.enableBody = true;
                var ground = that.platforms.create(0, game.world.height - 100, 'ground');

                //  This stops it from falling away when you jump on it
                ground.body.immovable = true;

                // Initialise the score
                that.score = 0;
                that.scoreText = game.add.text(16, 16, 'Score: ' + that.score, { fontSize: '32px', fill: '#000', fontFamily: "cursive" });

                that.enemy = Enemy(game);
                that.player = Player(game);

                that.emitter = game.add.emitter(0, 0, 200);
                that.emitter.makeParticles('pixel');
                that.emitter.gravity = 0;
                that.emitter.minParticleSpeed.setTo(-200, -200);
                that.emitter.maxParticleSpeed.setTo(200, 200);
            },

            update: function () {
                var that = this;
                that.player.body.velocity.x = 0;
                game.physics.arcade.collide(that.player, that.platforms);
                game.physics.arcade.collide(that.enemy, that.platforms);
                game.physics.arcade.collide(that.player, that.enemy, that.playerEnemyCallback.bind(that));
                that.enemy.updateMovement();
                that.player.updateMovement(cursors);
            },

            playerEnemyCallback: function (player, enemy) {
                var that = this;

                if (player.state === 'hit') {
                    // Don't want to repeat the action.
                    return;
                }

                var isPlayerHurt = player.body.touching.left || player.body.touching.right || player.body.touching.up;
                if (isPlayerHurt) {
                    player.animations.play('hit-by-enemy');
                    player.state = 'hit';

                    that.emitter.x = player.x + player.width / 2;
                    that.emitter.y = player.y + player.height / 2;
                    that.emitter.start(true, 300, null, 8);

                    window.setTimeout(function () {
                        player.state = 'normal';
                        player.body.x = player.initialPlayerPosition.x;
                        player.body.y = player.initialPlayerPosition.y;
                    }, 1000);
                }
                else {
                    that.emitter.x = enemy.x + enemy.width / 2;
                    that.emitter.y = enemy.y + enemy.height / 2;
                    that.score += enemy.scoreValue;

                    enemy.kill();
                    that.emitter.start(true, 300, null, 8);
                    that.scoreText.text = "Score: " + that.score;
                }

                that.hit.play('', 0, 0.5, false);
            }
        }
    };

    return Play;
});
