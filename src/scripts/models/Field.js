import {CellTypes} from "./CellTypes.js";
import {Actions} from "./Actions.js";
import Point from "../utils/Point.js";

const FIELD_WIDTH = 10;
const FIELD_HEIGHT = 20;

export default class Field {
    #cells = Array(FIELD_HEIGHT).fill(null).map(() => Array(FIELD_WIDTH).fill(CellTypes.FREE));
    #shapePosition = new Point(Field.WIDTH / 2 - 1, 3);
    #currentShape;

    static get WIDTH() {
        return FIELD_WIDTH;
    }

    static get HEIGHT() {
        return FIELD_HEIGHT;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {number} Type of the cell. Constant from the {@link Actions} enum.
     */
    getCell(x, y) {
        return this.#cells[y][x];
    }

    /**
     * Sets a new shape on the field and returns true, else false.
     * @param {Shape} shape New shape
     * @param {number} x x-coordinate of the shape center
     * @param {number} y y-coordinate of the shape center
     * @returns {boolean} Has a shape been set
     */
    setShape(shape, x, y) {
        const newPosition = new Point(x, y);
        const success = this.#isShapePositionCorrect(shape.calcCells(newPosition));
        if (success) {
            this.#currentShape?.calcCells(this.#shapePosition).forEach(point => {
                this.#cells[point.y][point.x] = CellTypes.FREE;
            });

            this.#currentShape = shape;
            this.#shapePosition = newPosition;
            this.#currentShape.calcCells(this.#shapePosition).forEach(point => {
                this.#cells[point.y][point.x] = CellTypes.SHAPE;
            });
        }
        return success;
    }


    /**
     * Sets the current shape on the new coordinates.
     * @param {number} x new x-coordinate of the shape center
     * @param {number} y new y-coordinate of the shape center
     * @returns {boolean} Has a shape been set
     */
    setShapePosition(x, y) {
        const newPosition = new Point(x, y);
        const success = this.#isShapePositionCorrect(this.#currentShape.calcCells(newPosition));
        if (success) {
            this.#currentShape.calcCells(this.#shapePosition).forEach(point => {
                this.#cells[point.y][point.x] = CellTypes.FREE;
            });

            this.#currentShape.calcCells(newPosition).forEach(point => {
                this.#cells[point.y][point.x] = CellTypes.SHAPE;
            });

            this.#shapePosition = newPosition;
        }
        return success;
    }


    /**
     * Moves the current shape.
     * @param{number} action Type of an action that will be done. Constant from {@link Actions}
     * @returns {boolean} Is the movement successful.
     */
    moveShape(action) {
        const currX = this.#shapePosition.x;
        const currY = this.#shapePosition.y;
        switch (action) {
            case Actions.DOWN:
                return this.setShapePosition(currX, currY + 1);
            case Actions.LEFT:
                return this.setShapePosition(currX - 1, currY);
            case Actions.RIGHT:
                return this.setShapePosition(currX + 1, currY);
            case Actions.ROTATE:
                return this.setShape(this.#currentShape.getNextRotation(), currX, currY)
            case Actions.SET:
                let success = false;
                do {
                    success = this.moveShape(Actions.DOWN);
                } while (success);
                return true;
            default:
                return false;
        }
    }

    /**
     * @returns {boolean} Can fix current shape
     */
    #canFixShape() {
        return this.#currentShape.calcCells(this.#shapePosition).some(point => {
            return point.y === FIELD_HEIGHT - 1 || this.getCell(point.x, point.y + 1) === CellTypes.SET;
        });
    }


    /**
     * Fixes the current shape on the field. Current shape will be null, if fixing is successful.
     * @returns {boolean} Is the shape fixing successful.
     */
    fixShape() {
        const success = this.#canFixShape();
        if (success) {
            this.#currentShape.calcCells(this.#shapePosition).forEach(cell => {
                this.#cells[cell.y][cell.x] = CellTypes.SET;
            });
            this.#currentShape = null;
        }
        return success;
    }


    /**
     * @param {[Point]} shapeCells Points with the coordinates of the current shape cells in the field coordinate system
     * @returns {boolean} Is the current shape position correct.
     */
    #isShapePositionCorrect(shapeCells) {
        return shapeCells.every(cell => {
            return 0 <= cell.x && cell.x < FIELD_WIDTH && 0 <= cell.y && cell.y < FIELD_HEIGHT &&
                this.#cells[cell.y][cell.x] !== CellTypes.SET;
        });
    }


    /**
     * Deletes completed lines in the field
     * @returns {number} Number of deleted lines.
     */
    clearCompletedLines() {
        let deletedLines = 0;
        for (let line = 0; line < FIELD_HEIGHT; line++) {
            const row = this.#cells[line];
            if (row.every(cell => cell === CellTypes.SET)) {
                for (let y = line; y >= 1; y--) {
                    this.#cells[y] = this.#cells[y - 1];
                }
                this.#cells[0] = new Array(FIELD_WIDTH).fill(CellTypes.FREE);
                deletedLines++;
            }

        }
        return deletedLines;
    }
}