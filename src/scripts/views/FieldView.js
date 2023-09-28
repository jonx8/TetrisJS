import Field from "../models/Field.js";
import {CellTypes} from "../models/CellTypes.js";

export default class FieldView {
    #canvas;
    #context;
    cellStroke;
    colors = new Map([
        [CellTypes.FREE, "white"],
        [CellTypes.SET, "brown"],
        [CellTypes.SHAPE, "green"]
    ]);


    /**
     * @constructor
     * @param{HTMLCanvasElement} canvas canvas object for the game board view.
     */
    constructor(canvas) {
        this.#canvas = canvas;
        this.#context = canvas.getContext("2d");
    }


    /**
     * Draws game tetris in the canvas element.
     * @param{Field} field - field that will be drawn.
     */
    draw(field) {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        const cellSide = this.#canvas.width / Field.WIDTH;
        this.#context.stroke = this.cellStroke;
        for (let y = 0; y < Field.HEIGHT; y++) {
            for (let x = 0; x < Field.WIDTH; x++) {
                this.#context.fillStyle = this.colors.get(field.getCell(x, y));
                this.#context.fillRect(cellSide * x, cellSide * y, cellSide, cellSide);
                this.#context.strokeRect(cellSide * x, cellSide * y, cellSide, cellSide);
            }
        }
    }

    clear() {
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }
}
