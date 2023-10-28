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

import axios from 'axios';

/**
 * Fetches the repositories of a GitHub user.
 *
 * @param {string} username - The GitHub username to fetch repositories for.
 * @returns {Promise<any[]>} - A promise that resolves with an array of repositories.
 */
async function fetchUserRepos(username: string): Promise<any[]> {
    try {
        // GitHub API URL
        const apiUrl = `https://api.github.com/users/${username}/repos`;

        // Send a GET request to the GitHub API
        const response = await axios.get(apiUrl);

        // Check if the request was successful
        if (response.status === 200) {
            return response.data; // Array of repositories
        } else {
            throw new Error('Failed to fetch user repositories.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}

/**
 * Extracts relevant information from GitHub repositories.
 *
 * @param {any[]} repos - An array of GitHub repositories.
 * @returns {any[]} - An array of extracted information.
 */
function extractRepoInfo(repos: any[]): any[] {
    const extractedData = repos.map((repo) => ({
        name: repo.name,
        isPrivate: repo.private, // 'private' is a reserved word in strict mode
        fork: repo.fork,
        size: repo.size,
        language: repo.language,
    }));

    return extractedData;
}

// Check if the script is run directly using Node.js
if (require.main === module) {
    const username = process.argv[2]; // process.argv[0] is the Node.js path, process.argv[1] is the current script file path
    if (!username) {
        console.error('Please provide a username.');
        process.exit(1);
    }

    fetchUserRepos(username)
        .then((repos) => {
            const extractedInfo = extractRepoInfo(repos);
            console.table(extractedInfo);
        })
        .catch((err) => {
            console.error(err);
        });
}
