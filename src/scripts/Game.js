import FieldView from "./views/FieldView.js";
import Field from "./models/Field.js";
import Shape from "./models/Shape.js";
import {Actions} from "./models/Actions.js";
import Point from "./utils/Point.js";
import {nextShapeView, recordListView} from "./views/SectionsView.js";


// List of tetrominoes
const shapes = [
    new Shape([new Point(0, 1), new Point(0, -1), new Point(0, -2)]),
    new Shape([new Point(-1, 0), new Point(0, -1), new Point(0, -2)]),
    new Shape([new Point(0, -1), new Point(1, 0), new Point(0, 1)]),
    new Shape([new Point(1, 0), new Point(0, -1), new Point(0, -2)]),
    new Shape([new Point(0, -1), new Point(1, 0), new Point(1, 1)]),
    new Shape([new Point(-1, 1), new Point(-1, 0), new Point(0, -1)]),
    new Shape([new Point(1, 0), new Point(0, -1), new Point(1, -1)])
];

// Control settings map
const keyMap = new Map([
    ["ArrowDown", Actions.SET],
    ["ArrowRight", Actions.RIGHT],
    ["ArrowLeft", Actions.LEFT],
    ["ArrowUp", Actions.ROTATE]
]);


/**
 * Controller of the tetris game process.
 */
export default class Game {
    #fieldView;
    #gameField;
    #level;
    #maxLevel;
    #fallDelay;
    #fallDelayDecrement;
    #nextShapeInd;
    #intervalId;
    #score;
    #isStart;

    /**
     * @constructor
     * @param canvas{HTMLCanvasElement} Canvas object for the game board view.
     * @param maxLevel{number} Maximum level in the game. The game ends with victory when the level reaches maxLevel.
     * @param fallDelay{number} Delay time between tetramino falls on the first level in milliseconds.
     * @param fallDelayDec{number} Number of milliseconds by which {@link fallDelay} is reduced with each level.
     */
    constructor(canvas, maxLevel = 8, fallDelay = 1000, fallDelayDec = 100) {
        this.#fieldView = new FieldView(canvas);
        this.#maxLevel = maxLevel;
        this.#isStart = false;
        this.#fallDelay = fallDelay;
        this.#fallDelayDecrement = fallDelayDec;
        this.#level = 1;
        this.#score = 0;
    }


    /**
     * Sets control settings. Using {@link keyMap} content.
     */
    #bindControl() {
        document.onkeydown = event => {
            if (keyMap.has(event.code)) {
                this.gameLoop(keyMap.get(event.code));
            }
        }
    }


    /**
     * Stores the player's current score in {@link localStorage} if that score exceeds the record.
     */
    storeRecord() {
        let username = localStorage.getItem("username.tetris");
        let records = JSON.parse(localStorage.getItem("records") ?? "{}");
        if (records.hasOwnProperty(username)) {
            records[username] = records[username] < this.#score
                ? this.#score
                : records[username];
        } else {
            records[username] = this.#score;
        }
        localStorage.setItem('records', JSON.stringify(records));
    }

    get isStart() {
        return this.#isStart;
    }


    /**
     * Used to move a shape into a field with appropriate checks to maintain the state of the {@link Field} object.
     * It is designed to be used in {@link setTimeout} function.
     * @param{number} action Type of an action that will be done. Constant from {@link Actions}
     */
    gameLoop(action = Actions.DOWN) {
        this.#gameField.moveShape(action);
        if (this.#gameField.fixShape()) {
            this.#score += 250 * this.#gameField.clearCompletedLines();
            if (!this.#gameField.setShape(shapes[this.#nextShapeInd], Field.WIDTH / 2 - 1, 3)) {
                this.stop();
                return;
            }
            this.#nextShapeInd = Math.floor(Math.random() * shapes.length);
            nextShapeView(shapes[this.#nextShapeInd]);

            // Update score
            const scoreElements = document.getElementsByClassName("score");
            for (let elem of scoreElements) {
                elem.innerText = this.#score;
            }
            if (this.#score > 0 && this.#score >= this.#level * 500) {
                this.#switchLevel();
            }

        }
        document.querySelector(".current-level").innerText = this.#level;
        this.#fieldView.draw(this.#gameField);
    }


    /**
     * Switches on the new level. Reduces delay between falls, increments level field and checks if the level is maximum.
     */
    #switchLevel() {
        this.#level++;
        clearInterval(this.#intervalId);
        this.#fallDelay -= this.#fallDelayDecrement;
        this.#intervalId = setInterval(() => this.gameLoop(), this.#fallDelay);
        if (this.#level === this.#maxLevel) {
            this.stop("Победа");
        }
    }

    /**
     * Restores the game state to the initial state. It is required to restart the game.
     */
    #setInitialSettings() {
        this.#score = 0;
        this.#fallDelay += (this.#level - 1) * this.#fallDelayDecrement;
        this.#level = 1;
        this.#gameField = new Field();
    }

    /**
     * Starts the game.
     */
    start() {
        this.#isStart = true;
        this.#setInitialSettings();
        this.#bindControl();

        document.querySelector(".records").style.visibility = "hidden";
        const startButton = document.querySelector(".start-game-btn");
        startButton.innerText = "Стоп";
        startButton.disabled = false;


        // Set first shape
        let shapeInd = Math.floor(Math.random() * shapes.length);
        this.#nextShapeInd = Math.floor(Math.random() * shapes.length);

        this.#gameField.setShape(shapes[shapeInd], Field.WIDTH / 2 - 1, 3);
        this.#intervalId = setInterval(() => this.gameLoop(), this.#fallDelay);

        nextShapeView(shapes[this.#nextShapeInd]);
        const scoreElements = document.getElementsByClassName("score");
        for (let elem of scoreElements) {
            elem.innerText = this.#score;
        }
        this.#fieldView.draw(this.#gameField);
    }


    /**
     * Stops the game. If finalTitle is specified, it displays records list.
     * @param {string} finalTitle The title that will be displayed in the list of records. If the player won,
     * finalTitle must be "Победа".
     */
    stop(finalTitle = "Поражение") {
        this.#isStart = false;
        document.onkeydown = null;
        clearInterval(this.#intervalId);

        const startButton = document.querySelector(".start-game-btn");
        startButton.innerText = "Старт";

        this.storeRecord();
        if (finalTitle) {
            recordListView(finalTitle);
            startButton.disabled = true;
        }

    }
}