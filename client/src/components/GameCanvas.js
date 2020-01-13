import React, {useEffect} from 'react';
import { createGame } from '../game/setup';
import MenuButton from './MenuButton';

const GameCanvas = ({ user }) => {
    useEffect(() => {
        window.discord = user; // REPLACE WITH STATE MANAGER
        createGame(); // Phaser setup
    });
    return (
        <div>
            <div id="game"></div>
            <MenuButton user={user} />
        </div>
    )
}

export default GameCanvas;