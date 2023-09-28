import Point from "../utils/Point.js";

export default class Shape {
    shifts;

    /**
     * @constructor
     * @param{[Point]} shifts Array of the shape cells coordinates relative to the center point.
     */
    constructor(shifts) {
        this.shifts = shifts;
    }

    /**
     * Calculates coordinates of the shape cells in the field coordinate system
     * @param centerPoint Center point of the shape in the field coordinate system.
     * @returns {[Point]} Points with the coordinates of the current shape cells in the field coordinate system
     */
    calcCells(centerPoint) {

        const shapeCells = [centerPoint];
        for (let cell of this.shifts) {
            shapeCells.push(new Point(centerPoint.x + cell.x, centerPoint.y + cell.y));
        }
        return shapeCells;
    }


    /**
     * @returns {Shape} New shape object that is a rotation of the current shape.
     */
    getNextRotation() {
        const newShifts = [];
        // Multiply the rotate matrix by every point
        this.shifts.forEach(({x, y}) => newShifts.push(new Point(-y, x)));
        return new Shape(newShifts);
    }

}