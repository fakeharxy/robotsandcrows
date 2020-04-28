import { PhysicalObject2D, BaseTypes } from 'lance-gg';

let game = null;
let p2 = null;

export default class Aviary extends PhysicalObject2D {

    /* no netScheme required
    static get netScheme() {
        return Object.assign({
            level: { type: BaseTypes.TYPES.INT16 }
        }, super.netScheme);
    }
    */

    /* no movement so no bending required
    // position bending: bend fully to server position in each sync [percent=1.0],
    // unless the position difference is larger than 4.0 (i.e. wrap beyond bounds)
    get bending() {
        return { position: { max: 4.0 } };
    }
    */

    // on add-to-world, create a physics body
    onAddToWorld() {
        game = this.gameEngine;
        p2 = game.physicsEngine.p2;
        this.physicsObj = new p2.Body({
            mass: this.mass, damping: 0, angularDamping: 0,
            position: [this.position.x, this.position.y],
            velocity: [this.velocity.x, this.velocity.y]
        });
        this.physicsObj.addShape(new p2.Circle({
            radius: game.aviaryRadius,
            collisionGroup: game.AVIARY, // Belongs to the AVIARY group
            collisionMask: game.ROBOT // Can collide with the ROBOT group only
        }));
        game.physicsEngine.world.addBody(this.physicsObj);
    }

    // on remove-from-world, remove the physics body
    onRemoveFromWorld() {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }

    syncTo(other) {
        super.syncTo(other);
    }

    toString() {
        return `Aviary::${super.toString()}`;
    }
}
