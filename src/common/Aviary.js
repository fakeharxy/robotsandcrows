'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';

export default class Aviary extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        if (props && props.playerId)
            this.playerId = props.playerId;
        this.class = Aviary;
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'aviary');
        }
    }
}
