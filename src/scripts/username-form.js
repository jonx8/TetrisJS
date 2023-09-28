"use strict";

const form = document.getElementById("username-form")
const input = document.getElementById('username-field');
const userMaxLength = 30;
window.onload = () => input.value = localStorage['username.tetris'] ?? "";


form.onsubmit = event => {
    // HTML injection protection
    let username = input.value.trim().replaceAll(/[<>]/g, "");
    if (username.length === 0 || userMaxLength > 30) {
        event.preventDefault();
        document.getElementById("username-field").focus();
    } else {
        localStorage['username.tetris'] = username;
    }
}

