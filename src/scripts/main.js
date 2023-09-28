"use strict";

import Game from "./Game.js";

const canvas = document.getElementById("canvas");
const startButton = document.querySelector(".start-game-btn");
const restartButton = document.querySelector(".restart-button");
const game = new Game(canvas, 10);

document.querySelector("#username-label > a").innerText = localStorage['username.tetris'];

startButton.addEventListener("click", () => {
    if (game.isStart) {
        game.stop();
    } else {
        game.start();
    }
});

restartButton.onclick = () => game.start();