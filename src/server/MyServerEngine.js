'use strict';

import ServerEngine from 'lance/ServerEngine';
import PlayerAvatar from '../common/PlayerAvatar';
import TwoVector from 'lance/serialize/TwoVector';

export default class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();
        this.gameEngine.initGame();
        this.players = {
            player1: null,
            player2: null
        };


        this.gameEngine.on('crowArrived', (e) => {
            console.log('crow arrived');
            if (e.crow.command) {
                if (e.crow.command == 'up') {
                    e.robot.velocity = new TwoVector(0, -0.5);
                } else if (e.crow.command == 'right') {
                    e.robot.velocity = new TwoVector(0.5, 0);
                } else if (e.crow.command == 'left') {
                    e.robot.velocity = new TwoVector(-0.5, 0);
                } else if (e.crow.command == 'down') {
                    e.robot.velocity = new TwoVector(0, 0.5);
                }
            } else {
                console.log('----missing command---');
                console.log(e.crow);
            }
        });
    }


    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        if (this.players.player1 === null) {
            this.players.player1 = socket.id;
            this.gameEngine.aviary1.playerId = socket.playerId;
        } else if (this.players.player2 === null) {
            this.players.player2 = socket.id;
            this.gameEngine.aviary2.playerId = socket.playerId;
        }
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        if (this.players.player1 == socketId) {
            console.log('Player 1 disconnected');
            this.players.player1 = null;
        } else if (this.players.player2 == socketId) {
            console.log('Player 2 disconnected');
            this.players.player2 = null;
        }
        delete this.gameEngine.world.objects[playerId];
    }
}
