"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = exports.generateRandomString = void 0;
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        res += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return res;
}
exports.generateRandomString = generateRandomString;
function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}
exports.wait = wait;
