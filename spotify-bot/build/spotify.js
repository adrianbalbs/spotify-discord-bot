"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiscordUser = exports.getUserTokenAndStore = void 0;
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("./helpers");
async function getUserTokenAndStore(state, userId, user) {
    let loginDelay = 8000;
    for (let i = 0; i < 11; i++) {
        await (0, helpers_1.wait)(loginDelay);
        const res = await getUserToken(state);
        console.log(res);
        if (res) {
            registerUser(state, userId, user);
            console.log(`Spotify user logged in with auth sesssion for ${user} ID: ${userId}`);
            return true;
        }
        if (!res && i == 10) {
            console.error(`Login timed out for ${user} ID: ${userId}`);
            return false;
        }
        if (!res) {
            loginDelay += 3000;
        }
    }
    return false;
}
exports.getUserTokenAndStore = getUserTokenAndStore;
async function getUserToken(state) {
    const res = await axios_1.default.get('http://localhost:3000/api/user/token', { params: { state: state } });
    if (res.data === null) {
        return false;
    }
    return true;
}
async function getDiscordUser(discordId) {
    const res = await axios_1.default.get('http://localhost:3000/api/user/discord', { params: { discordId: discordId } });
    if (res.data === null) {
        return false;
    }
    return true;
}
exports.getDiscordUser = getDiscordUser;
async function registerUser(state, userId, user) {
    const response = await axios_1.default.post('http://localhost:3000/api/user/register', {
        discordId: userId,
        username: user,
        state: state,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(response.data);
}
