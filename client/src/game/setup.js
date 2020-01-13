import Phaser from 'phaser';
import MainScene from '../game/MainScene';

// Setup Phaser
export const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: MainScene
};
export const createGame = () => new Phaser.Game(config);