import { Renderer } from 'lance-gg';
import Aviary from '../common/Aviary';
import Crow from '../common/Crow';
import Robot from '../common/Robot';

const col_aviary = '#35F';
const col_crow = '#ABF';
const col_robot = '#A0A0A0';

let ctx = null;
let game = null;
let canvas = null;

export default class RoCrowsRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        game = gameEngine;

        // Init canvas
        canvas = document.createElement('canvas');
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        document.body.insertBefore(canvas, document.getElementById('logo'));
        game.w = canvas.width;
        game.h = canvas.height;
        game.zoom = game.h / game.spaceHeight;
        if (game.w / game.spaceWidth < game.zoom) game.zoom = game.w / game.spaceWidth;
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 2 / game.zoom;
        ctx.strokeStyle = 'black';

        // remove instructions on first input
        setTimeout(this.removeInstructions.bind(this), 5000);
    }

    draw(t, dt) {
        super.draw(t, dt);

        // Clear the canvas
        ctx.clearRect(0, 0, game.w, game.h);

        // Transform the canvas
        // Note that we need to flip the y axis since Canvas pixel coordinates
        // goes from top to bottom, while physics does the opposite.
        ctx.save();
        ctx.translate(game.w/2, game.h/2); // Translate to the center TODO: consider if this is best for RoCrows2
        ctx.scale(game.zoom, -game.zoom);  // Zoom in and flip y axis

        // Draw all things
        this.drawBounds();
        game.world.forEachObject((id, obj) => {
            if (obj instanceof Aviary) this.drawAviary(obj.physicsObj);
            else if (obj instanceof Robot) this.drawRobot(obj.physicsObj);
            else if (obj instanceof Crow) this.drawCrow(obj.physicsObj);
        });

        // update status and restore
        this.updateStatus();
        ctx.restore();
    }

    updateStatus() {

        let playerShip = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId });

        if (!playerShip) {
            if (this.lives !== undefined)
                document.getElementById('gameover').classList.remove('hidden');
            return;
        }

        // update lives if necessary
        if (playerShip.playerId === this.gameEngine.playerId && this.lives !== playerShip.lives) {
            document.getElementById('lives').innerHTML = 'Lives ' + playerShip.lives;
            this.lives = playerShip.lives;
        }
    }

    removeInstructions() {
        document.getElementById('instructions').classList.add('hidden');
        document.getElementById('instructionsMobile').classList.add('hidden');
    }

    drawRobot(body) {
        let size = 0.5 * body.shapes[0].width; // width and height are the same; robot is square
        let armSize = size * 0.4;
        ctx.save();
        ctx.fillStyle = col_robot;
        ctx.translate(body.position[0], body.position[1]); // Translate to the robot center
        ctx.rotate(body.angle); // Rotate to robot orientation TODO: could be interesting
        
        //left arm
        ctx.beginPath();
        ctx.moveTo(-size        , -armSize);
        ctx.lineTo(-size-armSize, -armSize);
        ctx.lineTo(-size-armSize,  armSize);
        ctx.lineTo(-size        ,  armSize);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        
        //right arm
        ctx.beginPath();
        ctx.moveTo( size        , -armSize);
        ctx.lineTo( size+armSize, -armSize);
        ctx.lineTo( size+armSize,  armSize);
        ctx.lineTo( size        ,  armSize);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        
        //body
        ctx.beginPath();
        ctx.moveTo(-size,-size);
        ctx.lineTo(-size, size);
        ctx.lineTo( size, size);
        ctx.lineTo( size,-size);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.restore();

    }

    drawAviary(body) {
        ctx.save();
        //ctx.translate(body.position[0], body.position[1]);  // Translate to the center
        //ctx.rotate(body.angle);
        ctx.fillStyle = col_aviary;
        ctx.beginPath();
        ctx.arc(body.position[0], body.position[1], game.aviaryRadius, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    drawCrow(body) {
        ctx.save();
        ctx.fillStyle = col_crow;
        ctx.beginPath();
        ctx.arc(body.position[0], body.position[1], game.crowRadius, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }

    drawBounds() {
        ctx.beginPath();
        ctx.moveTo(-game.spaceWidth/2, -game.spaceHeight/2);
        ctx.lineTo(-game.spaceWidth/2, game.spaceHeight/2);
        ctx.lineTo( game.spaceWidth/2, game.spaceHeight/2);
        ctx.lineTo( game.spaceWidth/2, -game.spaceHeight/2);
        ctx.lineTo(-game.spaceWidth/2, -game.spaceHeight/2);
        ctx.closePath();
        ctx.stroke();
    }

}
