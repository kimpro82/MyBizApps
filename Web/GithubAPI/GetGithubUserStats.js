"use strict";
/**
 * GitHub Repository Information Extractor
 *
 * This script fetches information about a GitHub user's repositories using the GitHub API
 * and extracts relevant data
 *
 * @author  : kimpro82
 * @version : 0.1
 * @history
 *    0.1 2023.10.26 - Initial commit
 *        Created fetchUserRepos(), extractRepoInfo(), and some test code only run in console.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
/**
 * Fetches the repositories of a GitHub user.
 *
 * @param {string} username - The GitHub username to fetch repositories for.
 * @returns {Promise<any[]>} - A promise that resolves with an array of repositories.
 */
function fetchUserRepos(username) {
    return __awaiter(this, void 0, void 0, function () {
        var apiUrl, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    apiUrl = "https://api.github.com/users/".concat(username, "/repos");
                    return [4 /*yield*/, axios_1.default.get(apiUrl)];
                case 1:
                    response = _a.sent();
                    // Check if the request was successful
                    if (response.status === 200) {
                        return [2 /*return*/, response.data]; // Array of repositories
                    }
                    else {
                        throw new Error('Failed to fetch user repositories.');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error:', error_1.message);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Extracts relevant information from GitHub repositories.
 *
 * @param {any[]} repos - An array of GitHub repositories.
 * @returns {any[]} - An array of extracted information.
 */
function extractRepoInfo(repos) {
    var extractedData = repos.map(function (repo) { return ({
        name: repo.name,
        isPrivate: repo.private,
        fork: repo.fork,
        size: repo.size,
        language: repo.language,
    }); });
    return extractedData;
}
// Check if the script is run directly using Node.js
if (require.main === module) {
    var username = process.argv[2]; // process.argv[0] is the Node.js path, process.argv[1] is the current script file path
    if (!username) {
        console.error('Please provide a username.');
        process.exit(1);
    }
    fetchUserRepos(username)
        .then(function (repos) {
        var extractedInfo = extractRepoInfo(repos);
        console.table(extractedInfo);
    })
        .catch(function (err) {
        console.error(err);
    });
}
