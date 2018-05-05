import ClientEngine from 'lance/ClientEngine';
import MyRenderer from '../client/MyRenderer';
import KeyboardControls from 'lance/controls/KeyboardControls';

export default class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.controls = new KeyboardControls(this);
        this.controls.bindKey('up', 'up');
        this.controls.bindKey('down', 'down');
        this.controls.bindKey('left', 'left');
        this.controls.bindKey('right', 'right');
        this.controls.bindKey('space', 'space');
    }

}
