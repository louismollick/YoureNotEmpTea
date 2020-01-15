import Phaser from "phaser";
import io from 'socket.io-client';
import { config } from './setup';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene',
        });
    }
    preload () {
        // Preload images
        this.load.image(
            "sky",
            "https://raw.githubusercontent.com/cattsmall/Phaser-game/5-2014-game/assets/sky.png"
        );
        this.load.spritesheet(
            "player",
            "https://raw.githubusercontent.com/cattsmall/Phaser-game/5-2014-game/assets/dude.png",
            {
              frameWidth: 32,
              frameHeight: 48
            }
        );
    }

    create () {
        this.socket = io(`${process.env.REACT_APP_SERVER_URI}?id=${window.discord.id}&token=${window.discord.token}`);
        
        const self = this;
        this.otherPlayers = this.physics.add.group();

        this.physics.add.sprite(config.width / 2, config.height / 2, "sky");

        // create player animations
        this.createAnimations();

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();

        // listen for web socket events
        this.socket.on('currentPlayers', (players) => {
            Object.keys(players).forEach((id) => {
                if (players[id].playerId === self.socket.id) self.createPlayer(players[id]);
                else self.addOtherPlayers(players[id]);
            });
        });

        this.socket.on('newPlayer', (playerInfo) => {
            self.addOtherPlayers(playerInfo);
        });

        this.socket.on('playerDisconnect', (playerId) => {
            self.otherPlayers.getChildren().forEach((player) => {
                if (playerId === player.playerId) player.destroy();
            });
        });

        this.socket.on('playerMoved', (playerInfo) => {
            self.otherPlayers.getChildren().forEach((player) => {
                if (playerInfo.playerId === player.playerId) {
                    player.anims.play(playerInfo.dir, true);
                    player.setPosition(playerInfo.x, playerInfo.y);
                }
            });
        });

        this.socket.on('disconnect', () => {
            alert("YEET");
        });
    }

    createPlayer(playerInfo) {
        // our player sprite created through the physics system
        this.player = this.add.sprite(0, 0, "player");

        this.container = this.add.container(playerInfo.x, playerInfo.y);
        this.container.setSize(32, 48);
        this.physics.world.enable(this.container);
        this.container.add(this.player);

        // don't go out of the map
        this.container.body.setCollideWorldBounds(true);
    }
    
    addOtherPlayers(playerInfo) {
        const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, "player");
        otherPlayer.setTint(Math.random() * 0xffffff);
        otherPlayer.playerId = playerInfo.playerId;
        this.otherPlayers.add(otherPlayer);
    }

    createAnimations(){
        // Create animations for player
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 0 }),
            repeat: -1
        });
        this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("player", { start: 1, end: 1 }),
            repeat: -1
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", { start: 2, end: 2 })
        });
        this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("player", { start: 3, end: 3 })
        });
    }

    update() {
        if (this.container) {
            this.container.body.setVelocity(0);

            // Horizontal movement
            if (this.cursors.left.isDown) this.container.body.setVelocityX(-80);
            else if (this.cursors.right.isDown) this.container.body.setVelocityX(80);

            // Vertical movement
            if (this.cursors.up.isDown) this.container.body.setVelocityY(-80);
            else if (this.cursors.down.isDown) this.container.body.setVelocityY(80);

            // Create update package
            const x = this.container.x;
            const y = this.container.y;
            let dir = null;
            
            // Update the animation last and give left/right animations precedence over up/down animations
            if (this.cursors.left.isDown) dir = "left";
            else if (this.cursors.right.isDown) dir = "right";
            else if (this.cursors.up.isDown) dir = "up";
            else if (this.cursors.down.isDown) dir = "down";
            else this.player.anims.stop();
            
            if(dir) this.player.anims.play(dir, true);

            if (this.container.oldPosition && (x !== this.container.oldPosition.x || y !== this.container.oldPosition.y || dir !== this.container.oldPosition.dir))
                this.socket.emit('playerMovement', { x, y, dir });

            // save old position data
            this.container.oldPosition = { x, y, dir };
        }
      }
}