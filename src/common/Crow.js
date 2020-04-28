import { PhysicalObject2D, BaseTypes } from 'lance-gg';

let game = null;
let p2 = null;

export default class Crow extends PhysicalObject2D {

    static get netScheme() {
        return Object.assign({
            message: { type: BaseTypes.TYPES.STRING }
        }, super.netScheme);
    }

    // position bending: bend fully to server position in each sync [percent=1.0],
    // unless the position difference is larger than 4.0 (i.e. wrap beyond bounds)
    // no angular velocity bending
    get bending() {
        return { 
            position: { max: 4.0 },
            angularVelocity: { percent: 0.0 }
        };
    }

    onAddToWorld() {
        game = this.gameEngine;
        p2 = game.physicsEngine.p2;

        this.physicsObj = new p2.Body({
            mass: this.mass, damping: 0, angularDamping: 0,
            position: [this.position.x, this.position.y],
            velocity: [this.velocity.x, this.velocity.y]
        });

         // Create crow shape
        let shape = new p2.Circle({
            radius: game.crowRadius,
            collisionGroup: game.CROW, // Belongs to the CROW group
            collisionMask: game.ROBOT // Can only collide with the ROBOT group
        });
        this.physicsObj.addShape(shape);
        game.physicsEngine.world.addBody(this.physicsObj);
    }

    onRemoveFromWorld(gameEngine) {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }

    syncTo(other) {
        super.syncTo(other);
        this.message = other.message;
    }

    toString() {
        return `Crow::${super.toString()} message=${this.message}`;
    }
}
