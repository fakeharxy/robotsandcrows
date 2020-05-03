import { PhysicalObject2D, BaseTypes, TwoVector } from 'lance-gg';

const GRAB_INACTIVE = 0;
const GRAB_SEARCHING = 1;
const GRAB_HOLDING = 2;

let game = null;
let p2 = null;

export default class Robot extends PhysicalObject2D {

    static get netScheme() {
        return Object.assign({
            grabState: { type: BaseTypes.TYPES.INT8 }
        }, super.netScheme);
    }
   
    // no position bending if difference is larger than 4.0 (i.e. wrap beyond bounds),
    // TODO which is needed? no angular velocity bending, no local angle bending
    get bending() {
        return {
            position: { max: 4.0 },
            //angularVelocity: { percent: 0.0 },
            //angleLocal: { percent: 0.0 }
        };
    }

    onAddToWorld(gameEngine) {
        game = gameEngine;
        p2 = gameEngine.physicsEngine.p2;

        this.grabState = GRAB_INACTIVE;

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
            damping: 0, angularDamping: 0.9 });
        this.physicsObj.addShape(this.shape);
        gameEngine.physicsEngine.world.addBody(this.physicsObj);
    }

    onRemoveFromWorld(gameEngine) {
        game.physicsEngine.world.removeBody(this.physicsObj);
    }

    updateGrabbedObject() {
        //also update position and velocity of grabbed object
        if (this.grabbedObject) {
            let grabVector = new TwoVector(this.physicsObj.position[0] + game.grabReach * Math.sin(this.physicsObj.angle), this.physicsObj.position[1] + game.grabReach * Math.cos(this.physicsObj.angle));
            this.grabbedObject.position = grabVector;
            this.grabbedObject.velocity.copy(this.velocity);
            this.grabbedObject.refreshToPhysics();
        }
    }

    setGrabInactive() {
        this.grabState = GRAB_INACTIVE;

        if (this.grabConstraint) {
            game.physicsEngine.world.removeConstraint(this.grabConstraint);
        }

        if (this.grabbedObject) {
            this.grabbedObject.velocity = new TwoVector(0,0);
            this.grabbedObject.refreshToPhysics();
            this.grabbedObject = undefined;
        }
    }
    
    setGrabSearching() {
        this.grabState = GRAB_SEARCHING;
    }

    setGrabHolding(object) {
        this.grabState = GRAB_HOLDING;
        this.grabbedObject = object;
        this.updateGrabbedObject(); //snap the grabbed object to its correct position
        this.grabConstraint = new game.physicsEngine.p2.DistanceConstraint(this.physicsObj, object.physicsObj, { collideConnected: false} );
        game.physicsEngine.world.addConstraint(this.grabConstraint);
    }

    isGrabInactive() {
        return this.grabState === GRAB_INACTIVE;
    }

    isGrabSearching() {
        return this.grabState === GRAB_SEARCHING;
    }

    isGrabHolding() {
        return this.grabState === GRAB_HOLDING;
    }


    toString() {
        return `Robot::${super.toString()} lives=${this.lives}`;
    }

    syncTo(other) {
        super.syncTo(other);
        //this.lives = other.lives;
        this.grabState = other.grabState;
    }
}
