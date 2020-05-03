import { ServerEngine, TwoVector } from 'lance-gg';
import Aviary from '../common/Aviary';
import Crow from '../common/Crow';
import Robot from '../common/Robot';

export default class RoCrowsServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        gameEngine.physicsEngine.world.on('beginContact', this.handleCollision.bind(this));
        gameEngine.on('releaseCrow', this.releaseCrow.bind(this));
    }

    start() {
        super.start();
        // aviaries replace asteroids, but they can only be created when a player joins
        //this.gameEngine.addAsteroids();
    }

    // handle a collision on server only
    handleCollision(evt) {

        // identify the two objects which collided
        let A;
        let B;
        this.gameEngine.world.forEachObject((id, obj) => {
            if (obj.physicsObj === evt.bodyA) A = obj;
            if (obj.physicsObj === evt.bodyB) B = obj;
        });

        // check bullet-asteroid and ship-asteroid collisions
        if (!A || !B) return;
        this.gameEngine.trace.trace(() => `collision between A=${A.toString()}`);
        this.gameEngine.trace.trace(() => `collision and     B=${B.toString()}`);
        
        if (A instanceof Crow && B instanceof Robot) this.gameEngine.crowArrived(A, B);
        if (B instanceof Crow && A instanceof Robot) this.gameEngine.crowArrived(B, A);

        if (A instanceof Robot && B instanceof Aviary) this.gameEngine.checkGrab(A, B);
        if (A instanceof Aviary && B instanceof Robot) this.gameEngine.checkGrab(B, A);
        
        if (B instanceof Robot && A instanceof Robot) this.gameEngine.robotCrash(A, B);
        
        //if (A instanceof Robot && B instanceof Asteroid) this.kill(A);
        //if (B instanceof Robot && A instanceof Asteroid) this.kill(B);

        // restart game
        /*
        if (this.gameEngine.world.queryObjects({ instanceType: Asteroid }).length === 0) this.gameEngine.addAsteroids();
        */
    }

    releaseCrow(aviary, key) {
        //console.log("player " + aviary.playerId + " pressed " + key);
        this.gameEngine.addCrow(aviary, key);
    }

    /* is this necessary ??
    cancelGrab(robotId) {
        console.log('cancelling grab for robot ' + robotId);
        let robot = this.gameEngine.world.queryObject({ id: robotId });
        if (robot && robot instanceof Robot) {
            robot.
        }
    }
    */

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        this.gameEngine.addAviary(socket.playerId);
        this.gameEngine.addRobot(socket.playerId);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        for (let o of this.gameEngine.world.queryObjects({ playerId }))
            this.gameEngine.removeObjectFromWorld(o.id);
    }
        


    /**
     *  from here onwards is old asteroids code 
     */
        
    // shooting creates a bullet
    shoot(player) {

        let radius = player.physicsObj.shapes[0].radius;
        let angle = player.physicsObj.angle + Math.PI / 2;
        let bullet = new Crow(this.gameEngine, {}, {
            mass: 0.05,
            position: new TwoVector(
                radius * Math.cos(angle) + player.physicsObj.position[0],
                radius * Math.sin(angle) + player.physicsObj.position[1]
            ),
            velocity: new TwoVector(
                2 * Math.cos(angle) + player.physicsObj.velocity[0],
                2 * Math.sin(angle) + player.physicsObj.velocity[1]
            ),
            angularVelocity: 0
        });
        let obj = this.gameEngine.addObjectToWorld(bullet);
        this.gameEngine.timer.add(this.gameEngine.bulletLifeTime, this.destroyBullet, this, [obj.id]);
    }

    // destroy the missile if it still exists
    destroyBullet(bulletId) {
        if (this.gameEngine.world.objects[bulletId]) {
            this.gameEngine.trace.trace(() => `bullet[${bulletId}] destroyed`);
            this.gameEngine.removeObjectFromWorld(bulletId);
        }
    }

    kill(ship) {
        if(ship.lives-- === 0) this.gameEngine.removeObjectFromWorld(ship.id);
    }

}
