(function () {
    "use strict";
    var game, main_state, x_vel;

    x_vel = 100;

    // We start by initializing Phaser
    // Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
    game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game_div');


    // And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
    main_state = {

        preload: function () {
            game.load.image('background', 'assets/greybackground.png');
            game.load.spritesheet('testsprite', 'assets/testsprite.png', 16, 16);
            game.load.image('ground', 'assets/ground.png');
        },

        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            this.background = game.add.sprite(0, 0, 'background');
            this.platforms = game.add.group();
            this.platforms.enableBody = true;
            var ground = this.platforms.create(0, game.world.height - 107, 'ground');

            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;

            this.sad_sprite = game.add.sprite(16, game.world.height - 300, 'testsprite');
            this.sad_sprite.scale.setTo(4, 4);

            //  We need to enable physics on the player
            game.physics.arcade.enable(this.sad_sprite);
            this.sad_sprite.body.gravity.y = 300;
            this.sad_sprite.body.collideWorldBounds = true;
            this.sad_sprite.body.bounce.y = 1;
            this.sad_sprite.body.bounce.x = 1;

            //  Our two animations, walking left and right.
            this.sad_sprite.animations.add('left', [0, 1, 2, 3, 4, 5, 6], 5, true);
            this.sad_sprite.animations.add('right', [7, 8, 9, 10, 11, 12, 13], 5, true);

            // Start the animation playing right
            this.sad_sprite.animations.play('right');
            this.sad_sprite.body.velocity.x = x_vel;
        },

        update: function () {
            game.physics.arcade.collide(this.sad_sprite, this.platforms);
            updateAnimation(this.sad_sprite);
        }
    };

    function updateAnimation(sprite) {
        var animationType = sprite.body.velocity.x < 0 ? 'left' : 'right';
        sprite.animations.play(animationType);

    }

    // And finally we tell Phaser to add and start our 'main' state
    game.state.add('main', main_state);
    game.state.start('main');

}());