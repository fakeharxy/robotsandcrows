'use strict';

import GameEngine from 'lance/GameEngine';
import SimplePhysicsEngine from 'lance/physics/SimplePhysicsEngine';
import PlayerAvatar from './PlayerAvatar';
import TwoVector from 'lance/serialize/TwoVector';
import Aviary from './Aviary';
import Robot from './Robot';
import Crow from './Crow';
const PADDING = 20;
const WIDTH = 400;
const HEIGHT = 400;
const ROBOT_WIDTH = 10;
const ROBOT_HEIGHT = 10;
const CROWSPEED = 0.5;
const ROBOTSPEED = 0.1;
const DIRECTIONS = ['up', 'down', 'left', 'right'];

export default class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });
        this.physicsEngine.options.COLLISION_DISTANCE = 4;
    }

    registerClasses(serializer) {
        serializer.registerClass(Aviary);
        serializer.registerClass(Robot);
        serializer.registerClass(Crow);
    }

    initGame() {
        this.addObjectToWorld(new Aviary(this, null, { position: new TwoVector(PADDING, HEIGHT / 2), playerId: 1 }));
        this.addObjectToWorld(new Aviary(this, null, { position: new TwoVector(WIDTH - PADDING, HEIGHT / 2), playerId: 2 }));
        this.addObjectToWorld(new Robot(this, null, { position: new TwoVector(PADDING * 5, HEIGHT / 2), playerId: 1 }));
        this.addObjectToWorld(new Robot(this, null, { position: new TwoVector(WIDTH - PADDING * 5, HEIGHT / 2), playerId: 2 }));
    }

    start() {

        super.start();

        this.on('postStep', () => { this.postStepHandleCrows(); });
        this.on('postStep', () => { this.postStepHandleRobots(); });

        this.on('collisionStart', (e) => {
            let collisionObjects = Object.keys(e).map((k) => e[k]);
            let crow = collisionObjects.find((o) => o instanceof Crow);
            let robot = collisionObjects.find((o) => o instanceof Robot);

            if (!crow || !robot)
                return;

            // make sure not to process the collision between a missile and the ship that fired it
            if (crow.playerId == robot.playerId) {
                console.log("crow collided with correct robot");
                //console.log(this.crowList);
                //let index = this.crowList.indexOf(crow);
                //if (index !== -1) this.crowList.splice(index, 1);
                delete this.crowList[crow];
                //console.log(this.crowList);
            
                if (crow.command) {
                    if (crow.command == 'up') {
                        robot.velocity = new TwoVector(0, -ROBOTSPEED);
                    } else if (crow.command == 'right') {
                        robot.velocity = new TwoVector(ROBOTSPEED, 0);
                    } else if (crow.command == 'left') {
                        robot.velocity = new TwoVector(-ROBOTSPEED, 0);
                    } else if (crow.command == 'down') {
                        robot.velocity = new TwoVector(0, ROBOTSPEED);
                    }
                } else {
                    console.log('----missing command---');
                    console.log(crow);
                }
                
                this.removeObjectFromWorld(crow);
                
                this.emit('crowArrived', { crow, robot });
            }

        });

        this.on('objectAdded', (object) => {
            console.log('-------- new ' + object.class.name + ' --------');
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
            width: WIDTH,
            height: HEIGHT
        };

        this.robotList = [];
        this.crowList = [];

    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let aviary = this.world.queryObject({ playerId });
        if (aviary) {
            console.log('player' + playerId + ' pressed ' + inputData.input);
            if (DIRECTIONS.includes(inputData.input)) {
                this.sendCrow(aviary, inputData.input);
                // this.emit('fire');
            }
        }
    }

    postStepHandleCrows() {
        for (let i = 0; i < this.crowList.length; i++) {
            let crow = this.crowList[i];
            if (crow) {
                if (crow.playerId == 1) {
                    crow.velocity = new TwoVector(CROWSPEED, 0);
                } else {
                    crow.velocity = new TwoVector(-CROWSPEED, 0);
                }
            }
        }
    }

    postStepHandleRobots() {
        for (let i = 0; i < this.robotList.length; i++) {
            let robot = this.robotList[i];
            if (robot) {
          // check robot hasn't killed itself etc
            }
        }
    }

    sendCrow(aviary, command) {
        this.addObjectToWorld(new Crow(this, null, { position: new TwoVector(aviary.position.x, aviary.position.y), playerId: aviary.playerId, command: command }));
    }
}
