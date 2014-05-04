define(['../sprites/enemy', '../sprites/player', '../sprites/boss' ], function (Enemy, Player, Boss) {

    var wave = 1;
    var numberOfWaves = 5;
    var state = 'creating';

    var Play = function (game) {
        return {
            create: function () {
                var that = this;
                that.cursors = game.input.keyboard.createCursorKeys();
                game.physics.startSystem(Phaser.Physics.ARCADE);

                that.music = game.add.audio('soundtrack');
                that.music.play('', 0, 0.5, true);
                that.hit = game.add.audio('hit');
                that.smash = game.add.audio('smash');
                that.ouch = game.add.audio('ouch');

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

                that.enemies = game.add.group();
                that.enemies.enableBody = true;

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
                game.physics.arcade.collide(that.enemies, that.platforms);
                game.physics.arcade.collide(that.enemies, that.enemies);

                game.physics.arcade.collide(that.player, that.enemies, that.playerEnemyCallback.bind(that));
                that.enemies.forEachAlive(function(enemy){
                    enemy.updateMovement();
                });

                that.player.updateMovement(that.cursors);

                if (state === 'creating' && wave <= numberOfWaves){
                    that.loadEnemies(wave);
                }

                if (state === 'creating' && wave > numberOfWaves){
                    that.loadBoss();
                }

                if (that.enemies.countLiving() === 0){
                    wave += 1;
                    state = 'creating';
                }
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

                    if (enemy.body.touching.left){
                        enemy.body.velocity.x = 100;
                    }
                    else if (enemy.body.touching.right){
                        enemy.body.velocity.x = -100;
                    }

                    enemy.body.velocity.y = -200;

                    that.ouch.play('', 0, 0.5, false);

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

                    if (!that.cursors.up.isDown){
                        player.body.velocity.y = -350;
                    }

                    enemy.kill();
                    that.emitter.start(true, 300, null, 8);
                    that.scoreText.text = "Score: " + that.score;

                    if (that.score % 500 === 0){
                        that.smash.play('', 0, 1, false);
                    }

                    that.hit.play('', 0, 0.5, false);
                }
            },

            loadEnemies : function(wave){
                var that = this;
                for (var i = 0; i < wave; i++){
                    var gravity = Math.random()*2*300;
                    var y = game.world.height - (300 + (wave / 2 * 50));
                    var initialVelocity = 100 + (Math.random() - 0.5)*50;
                    if (i % 2 === 0){
                        Enemy.add(game, that.enemies, {x: game.world.width - 0, y: y, initialVelocity: -initialVelocity, gravity: gravity  });
                    }
                    else{
                        Enemy.add(game, that.enemies, {x: 0, y: y, initialVelocity: initialVelocity, gravity : gravity });
                    }
                }

                state = 'loaded';
            },

            loadBoss : function() {
                var that = this;
                Boss.add(game, that.enemies);

                state = 'loaded';
            }
        }
    };

    return Play;
});
