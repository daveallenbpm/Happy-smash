(function () {
    "use strict";
    var game, main_state, x_vel, cursors;

    x_vel = -100;

    // We start by initializing Phaser
    // Parameters: width of the game, height of the game, how to render the game, the HTML div that will contain the game
    game = new Phaser.Game(1200, 600, Phaser.AUTO, 'game_div');


    // And now we define our first and only state, I'll call it 'main'. A state is a specific scene of a game like a menu, a game over screen, etc.
    main_state = {

        preload: function () {
            game.load.image('background', 'assets/greybackground.png');
            game.load.spritesheet('sadsprite', 'assets/sadsprite.png', 16, 16);
            game.load.image('ground', 'assets/ground.png');
            game.load.spritesheet('bigblueguy', 'assets/bigblueguy.png', 50, 50);
        },

        create: function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            cursors = game.input.keyboard.createCursorKeys();

            this.background = game.add.sprite(0, 0, 'background');
            this.platforms = game.add.group();
            this.platforms.enableBody = true;
            var ground = this.platforms.create(0, game.world.height - 100, 'ground');

            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;

            this.sad_sprite = game.add.sprite(game.world.width - 100, game.world.height - 300, 'sadsprite');
            this.sad_sprite.scale.setTo(4, 4);

            //  We need to enable physics on the player
            game.physics.arcade.enable(this.sad_sprite);
            this.sad_sprite.body.gravity.y = 300;
            this.sad_sprite.body.collideWorldBounds = true;
            this.sad_sprite.body.bounce.y = 1;
            this.sad_sprite.body.bounce.x = 1;
            this.sad_sprite.body.setSize(8, 12, -20, -6);

            //  Our two animations, walking left and right.
            this.sad_sprite.animations.add('left', [0, 1, 2, 3, 4, 5, 6], 5, true);
            this.sad_sprite.animations.add('right', [7, 8, 9, 10, 11, 12, 13], 5, true);

            // Start the animation playing right
            this.sad_sprite.animations.play('right');
            this.sad_sprite.body.velocity.x = x_vel;


            this.player = game.add.sprite(50, game.world.height - 300, 'bigblueguy');
            this.player.scale.setTo(2, 2);
            game.physics.arcade.enable(this.player);
            this.player.body.gravity.y = 600;
            this.player.body.collideWorldBounds = true;
            this.player.animations.add('right', [1,2,3,4], 6, true);
            this.player.animations.add('left', [5,6,7,8], 6, true);

        },

        update: function () {
            this.player.body.velocity.x = 0;

            game.physics.arcade.collide(this.sad_sprite, this.platforms);
            game.physics.arcade.collide(this.player, this.platforms);
            game.physics.arcade.collide(this.player, this.sad_sprite, function(){
               console.log("Collision!")
            });
            updateAnimation(this.sad_sprite);
            updatePlayerAnimation(this.player);
        }
    };

    function updateAnimation(sprite) {
        var animationType = sprite.body.velocity.x < 0 ? 'left' : 'right';
        sprite.animations.play(animationType);
    }

    function updatePlayerAnimation(player){
        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = cursors.left.shiftKey ? -400 : -200;
            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            if (cursors.right.shiftKey){
                console.log("Right key!")
            }
            player.body.velocity.x = cursors.right.shiftKey ? 400 : 200;
            player.animations.play('right');
        }
        else if (cursors.up.isDown){
        }
        else
        {
            //  Stand still
            player.animations.stop();
            player.frame = 0;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -350;
        }
    }

    // And finally we tell Phaser to add and start our 'main' state
    game.state.add('main', main_state);
    game.state.start('main');

}());