import { GameEngine, P2PhysicsEngine, TwoVector } from 'lance-gg';
import Aviary from './Aviary';
import Crow from './Crow';
import Robot from './Robot';

export default class RoCrowsGameEngine extends GameEngine {

    constructor(options) {
        super(options);

        // create physics with no friction; wrap positions after each step
        this.physicsEngine = new P2PhysicsEngine({ gameEngine: this });
        this.physicsEngine.world.defaultContactMaterial.friction = 0;
        this.on('postStep', this.warpAll.bind(this));

        //steer crows towards robots each step
        this.on('postStep', this.steerCrows.bind(this));


        // game variables
        Object.assign(this, {
            /*
            lives: 3, shipSize: 0.3, shipTurnSpeed: 0.05, shipSpeed: 2, bulletRadius: 0.03, bulletLifeTime: 60,
            asteroidRadius: 0.9, numAsteroidLevels: 4, numAsteroidVerts: 6, maxAsteroidSpeed: 2,
            */
            spaceWidth: 16, spaceHeight: 9, 

            aviaryRadius: 0.1,
            crowRadius: 0.06,
            robotSize: 0.2,

            crowSpeed: 1.5,
            robotSpeed: 0.5,

            grabDuration: 120,
            grabReach: 0.2,
            grabTolerance: 0.05,

            // collision groups
            ROBOT: Math.pow(2, 1), CROW: Math.pow(2, 2), AVIARY: Math.pow(2, 3),
        });
    }

    // steer the crows towards their players' robots
    steerCrows() {
        this.world.queryObjects({ instanceType: Crow }).forEach(crow => {
            // find corresponding robot
            let robot = this.world.queryObject({ playerId: crow.playerId, instanceType: Robot });
            if (robot) {
              // calculate crow vector based on target robot
              let vecBearing = new TwoVector();
              vecBearing.copy(robot.position);
              vecBearing.subtract(crow.position);
              let scaleFactor = this.crowSpeed / vecBearing.length();
              vecBearing.multiplyScalar(scaleFactor);
              crow.velocity = vecBearing;
              crow.refreshToPhysics();
            }
        });

    }

    // If the body is out of space bounds, warp it to the other side
    warpAll() {
        this.world.forEachObject((id, obj) => {
            let p = obj.position;
            if(p.x > this.spaceWidth/2) p.x -= this.spaceWidth;
            if(p.y > this.spaceHeight/2) p.y -= this.spaceHeight;
            if(p.x < -this.spaceWidth /2) p.x += this.spaceWidth;
            if(p.y < -this.spaceHeight/2) p.y += this.spaceHeight;
            obj.refreshToPhysics();
        });
    }

    registerClasses(serializer) {
        serializer.registerClass(Robot);
        serializer.registerClass(Aviary);
        serializer.registerClass(Crow);
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // handle keyboard presses
        // if immediate responses are required, they can be handled here but use extreme caution (or learn about shadow objects) if new objects will have to be created
        let playerAviary = this.world.queryObject({ playerId: playerId, instanceType: Aviary });
        if (playerAviary) {
            this.emit('releaseCrow', playerAviary, inputData.input);
        }
    }

    // returns a random number between -0.5 and 0.5
    rand() {
        return Math.random() - 0.5;
    }

    // create aviary
    addAviary(playerId) {
        let x = this.rand() * this.spaceWidth;
        let y = this.rand() * this.spaceHeight;
        let vx = 0;
        let vy = 0;
        let va = 0;
        
        let a = new Aviary(this, {}, {
            playerId: playerId,
            mass: 1000, angularVelocity: va,
            position: new TwoVector(x, y),
            velocity: new TwoVector(vx, vy)
        });
        this.addObjectToWorld(a);
    }
    
    // create robot
    addRobot(playerId) {
        //find player's aviary and place robot nearby
        let playerAviaryBody = this.world.queryObject({ playerId: playerId, instanceType: Aviary }).physicsObj;
        let x = playerAviaryBody.position[0];
        x += this.aviaryRadius * 3 * (x > 0 ? -1 : 1);
        let y = playerAviaryBody.position[1];
        //y += this.aviaryRadius * 3 * (y > 0 ? -1 : 1);
        let vx = 0;
        let vy = 0;

        let s = new Robot(this, {}, {
            playerId: playerId,
            mass: 10, angularVelocity: 0,
            position: new TwoVector(x, y), 
            velocity: new TwoVector(vx, vy)
        });
        //s.lives = this.lives;
        this.addObjectToWorld(s);
    }
    
    addCrow(playerAviary, key) {
        //release a crow from the aviary
        let vx = 0;
        let vy = 0;

        let crow = new Crow(this, {}, {
            playerId: playerAviary.playerId,
            mass: 0.0001, angularVelocity: 0,
            position: playerAviary.position, //is copied anyway
            velocity: new TwoVector(vx, vy)
        });
        crow.message = key;
        if (crow.message === 'up') {
            crow.messageAngle = 0;
        } else if (crow.message === 'right') {
            crow.messageAngle = Math.PI / 2;
        } else if (crow.message === 'left') {
            crow.messageAngle = -Math.PI / 2
        } else if (crow.message === 'down') {
            crow.messageAngle = Math.PI;
        }
        this.addObjectToWorld(crow);
    }

    // crow has arrived at a robot; can possibly deliver message
    crowArrived(crow, robot) {
        if (crow.playerId === robot.playerId) {
            //console.log("crow delivered message " + crow.message);
            if (crow.message === 'up') {
                robot.velocity = new TwoVector(0, this.robotSpeed);
                robot.angle = crow.messageAngle;
            } else if (crow.message === 'right') {
                robot.velocity = new TwoVector(this.robotSpeed, 0);
                robot.angle = crow.messageAngle;
            } else if (crow.message === 'left') {
                robot.velocity = new TwoVector(-this.robotSpeed, 0);
                robot.angle = crow.messageAngle;
            } else if (crow.message === 'down') {
                robot.velocity = new TwoVector(0, -this.robotSpeed);
                robot.angle = crow.messageAngle;

            } else if (crow.message === 'space') {
                console.log("grab message received by robot!");
                if (robot.isGrabHolding()) {
                    //TODO: update the carried object - here or in cancelGrab?
                    this.cancelGrab(robot, true);
                } else if (!robot.isGrabSearching()) {
                    robot.setGrabSearching();
                    this.timer.add(this.grabDuration, this.cancelGrab, this, [robot.id, false]);
                } else {
                    console.log("robot ignored it, grabState is currently " + robot.grabState);
                }
            }

            robot.angularVelocity = 0;
            robot.refreshToPhysics();
            robot.updateGrabbedObject();
            this.removeObjectFromWorld(crow.id);
        } else {
            console.log("crow flew over competitor robot");
        }
    }

    cancelGrab(robot, force) {
        //the method can be called with Robot object or id
        if (!(robot instanceof Robot)) {
            console.log("looking up robot by id " + robot);
            robot = this.world.queryObject({ id: robot });
        }
        //this.emit('cancelGrab', robotId); // it does not seem necessary to emit this; not sure quite why yet
        if (robot && robot instanceof Robot && (force || robot.isGrabSearching())) {
            console.log("cancelling grab");
            robot.setGrabInactive();
            //TODO drop any carried object?
        }
    }

    // robot has collided with something - see if it can be grabbed
    checkGrab(robot, object) {
        if (robot.isGrabSearching()) {            
            if (object instanceof Aviary) {
                if (this.isInGrabRange(robot, object)) {
                    console.log("aviary grabbed!");
                    robot.setGrabHolding(object);
                }
            }
            // TODO also allow picking up other Robots
        }
    }

    isInGrabRange(robot, object) {
        let body = robot.physicsObj;
        //calculate grab point
        let grabVector = new TwoVector(body.position[0] + this.grabReach * Math.sin(body.angle), body.position[1] + this.grabReach * Math.cos(body.angle));

        // calculate distance from grabpoint to object centre
        grabVector.subtract(object.position);
        if (grabVector.length() < this.grabTolerance) {
            return true;
        } else {
            console.log("distance from grabpoint to object too big: " + grabVector.length());
        }
        return false;
    }

    // two robots have hit each other TODO dead stop? bounce? damage? grab?
    robotCrash(robot1, robot2) {
        console.log("robot crash!");
    }

    // asteroid explosion
    explode(asteroid, bullet) {

        // Remove asteroid and bullet
        let asteroidBody = asteroid.physicsObj;
        let level = asteroid.level;
        let x = asteroidBody.position[0];
        let y = asteroidBody.position[1];
        let r = this.asteroidRadius * (this.numAsteroidLevels - level) / this.numAsteroidLevels;
        this.removeObjectFromWorld(asteroid);
        this.removeObjectFromWorld(bullet);

        // Add new sub-asteroids
        if (level < 3) {
            let angleDisturb = Math.PI/2 * Math.random();
            for (let i=0; i<4; i++) {
                let angle = Math.PI/2 * i + angleDisturb;
                let subAsteroid = new Asteroid(this, {}, {
                    mass: 10,
                    position: new TwoVector(x + r * Math.cos(angle), y + r * Math.sin(angle)),
                    velocity: new TwoVector(this.rand(), this.rand())
                });
                subAsteroid.level = level + 1;
                this.trace.info(() => `creating sub-asteroid with radius ${r}: ${subAsteroid.toString()}`);
                this.addObjectToWorld(subAsteroid);
            }
        }
    }
}
