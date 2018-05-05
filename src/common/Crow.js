'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

export default class Crow extends DynamicObject {

    get bendingMultiple() { return 0.8; } // not sure on this yet
    get bendingVelocityMultiple() { return 0; } // or this

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        if (props && props.playerId)
            this.playerId = props.playerId;
        if (props && props.command) {
            this.command = props.command;
        }
        this.class = Crow;
       // this.velocity.set(2, 2);
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'crow');
        }
    }
}
