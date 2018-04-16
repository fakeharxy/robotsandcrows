'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import PlayerAvatar from './PlayerAvatar';
import TwoVector from 'lance/serialize/TwoVector';
import Robot from './Robot';
import Crow from './Crow';
const PADDING = 20;
const WIDTH = 400;
const HEIGHT = 400;
const ROBOT_WIDTH = 10;
const ROBOT_HEIGHT = 10;
const DIRECTIONS = ['up', 'down', 'left', 'right'];

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });
    }

    registerClasses(serializer) {
        serializer.registerClass(Aviary);
        serializer.registerClass(Robot);
        serializer.registerClass(Crow);
    }

    initGame() {
       this.addObjectToWorld(new Aviary(this, null, { position: new TwoVector(PADDING, HEIGHT / 2), playerId: 1 }));
       this.addObjectToWorld(new Aviary(this, null, { position: new TwoVector(WIDTH - PADDING, HEIGHT / 2), playerId: 2 }));
       this.addObjectToWorld(new Robot(this, null, { position: new TwoVector(PADDING + PADDING, HEIGHT / 2), playerId: 1 }));
       this.addObjectToWorld(new Robot(this, null, { position: new TwoVector(WIDTH - PADDING - PADDING, HEIGHT / 2), playerId: 2 }));
    }

    start() {

        super.start();

        this.on('postStep', () => { this.postStepHandleCrows(); });
        this.on('postStep', () => { this.postStepHandleRobots(); });

        this.on('objectAdded', (object) => {
            if (object.class === Crow) {
                this.crowList.push(object);
            } else if (object.class === Robot) {
                this.robotList.push(object);
            } else if (object.playerId === 1) {
                this.aviary1 = object;
            } else if (object.playerId === 2) {
                this.aviary2 = object;
            }
        });

        this.worldSettings = {
            width: 800,
            height: 600
        };

        this.robotList = [];
        this.crowsList = [];

    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let aviary = this.world.getPlayerObject(playerId);
        if (aviary) {
            console.log('player ${playerId} pressed ${inputData.input}');
            if (DIRECTIONS.includes(inputData.input)) {
                this.sendCrow(player, inputData.input);
                // this.emit('fire');
            }
        }
    }

    postStepHandleCrows() {
      for (i =0; i < crowList.length; i++) {
        let crow = crowList[i];
        if (crow) {
          if (crow.playerId == 1) {
            crow.velocity = new TwoVector(2,0);
          } else {
            crow.velocity = new TwoVector(-2,0);
          }
        }
      }
    }

    postStepHandleRobots() {
      for (i = 0; i < robotList.length; i++) {
        let robot = robotList[i];
        if (robot) {
          //check robot hasn't killed itself etc
      }
    }

    sendCrow(aviary, command) {
      this.addObjectToWorld(new Crow(this, null, { position: new TwoVector(aviary.position.x, aviary.position.y), playerId: aviary.playerId, command: command }));,
  }
}
