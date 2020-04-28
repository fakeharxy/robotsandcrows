import { PhysicalObject2D, BaseTypes } from 'lance-gg';

let game = null;
let p2 = null;

export default class Robot extends PhysicalObject2D {

    /* no netScheme required yet
    static get netScheme() {
        return Object.assign({
            lives: { type: BaseTypes.TYPES.INT8 }
        }, super.netScheme);
    }
    */
   
    // no position bending if difference is larger than 4.0 (i.e. wrap beyond bounds),
    // no angular velocity bending, no local angle bending
    get bending() {
        return {
            position: { max: 4.0 },
            angularVelocity: { percent: 0.0 },
            angleLocal: { percent: 0.0 }
        };
    }

    onAddToWorld(gameEngine) {
        game = gameEngine;
        p2 = gameEngine.physicsEngine.p2;

        // Add robot physics
        this.shape = new p2.Box({
            width: game.robotSize,
            height: game.robotSize,
            collisionGroup: game.ROBOT, // Belongs to the ROBOT group
            collisionMask: game.ROBOT | game.AVIARY | game.CROW // collide with anything
        });
        this.physicsObj = new p2.Body({
            mass: 1,
            position: [this.position.x, this.position.y],
            angle: this.angle,
            damping: 0, angularDamping: 0 });
        this.physicsObj.addShape(this.shape);
        gameEngine.physicsEngine.world.addBody(this.physicsObj);
    }

    onRemoveFromWorld(gameEngine) {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }

    toString() {
        return `Robot::${super.toString()} lives=${this.lives}`;
    }

    syncTo(other) {
        super.syncTo(other);
        //this.lives = other.lives;
    }
}
