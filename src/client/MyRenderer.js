'use strict';

import Renderer from 'lance/render/Renderer';

export default class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
    }

    draw(t, dt) {
        super.draw(t, dt);

        for (let objId of Object.keys(this.sprites)) {
            if (this.sprites[objId].el) {
                let objData = this.gameEngine.world.objects[objId];
                if (objData) {
                    this.sprites[objId].el.style.top = objData.position.y + 'px';
                    this.sprites[objId].el.style.left = objData.position.x + 'px';
                }
            }
        }
    }

    addSprite(obj, objName) {
        objName += obj.playerId;
        //console.log(obj);
        this.sprites[obj.id] = {
            el: document.querySelector('.' + objName)
        };
    }

}
