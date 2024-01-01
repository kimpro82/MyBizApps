# [Github API (Web with TypeScript)](../../README.md#web)

Get *Github* user information by its REST API


### \<List>

- [List a User's Repositories (2023.10.26)](#list-a-users-repositories-20231026)


## [List a User's Repositories (2023.10.26)](#list)

- Fetch information about a *GitHub* user's repositories using the *GitHub API* and extracts relevant data
- Future Improvements
  - Also retrieve language statistics for each repository and combine them
  - Display the data using an SVG image
- REST API URL
  ```url
  https://api.github.com/users/{username}/repos
  ```
- Usage
  ```bash
  node GetGithubUserStats.js {username}
  ```
- Codes and Results
  <details>
    <summary>GetGithubUserStats.ts</summary>

  ```ts
  import axios from 'axios';
  ```
  ```ts
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
  ```
  ```ts
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
  ```
  ```ts
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
  ```
  </details>
  <details open="">
    <summary>Console Output</summary>

  ```ts
  ┌─────────┬───────────────────────┬───────────┬───────┬───────┬────────────────────┐
  │ (index) │         name          │ isPrivate │ fork  │ size  │      language      │
  ├─────────┼───────────────────────┼───────────┼───────┼───────┼────────────────────┤
  │    0    │  'Coursera_Capstone'  │   false   │ false │   1   │ 'Jupyter Notebook' │
  │    1    │ 'github-readme-stats' │   false   │ true  │ 3406  │        null        │
  │    2    │   'GodSaveTheQueen'   │   false   │ false │ 2190  │      'Python'      │
  │    3    │      'kimpro82'       │   false   │ false │  83   │        null        │
  │    4    │       'MOOCoke'       │   false   │ false │  74   │        null        │
  │    5    │    'MyAIPractice'     │   false   │ false │ 4955  │        'R'         │
  │    6    │      'MyBizApps'      │   false   │ false │ 1036  │       'VBA'        │
  │    7    │   'MyCodingContest'   │   false   │ false │  430  │       'C++'        │
  │    8    │    'MyFamilyCare'     │   false   │ false │ 8128  │       'VBA'        │
  │    9    │       'MyGame'        │   false   │ false │ 2597  │       'VBA'        │
  │   10    │ 'MyInvestmentModules' │   false   │ false │ 1172  │       'VBA'        │
  │   11    │     'MyPractice'      │   false   │ false │ 21271 │       'VBA'        │
  │   12    │    'MyWebPractice'    │   false   │ false │  408  │    'JavaScript'    │
  │   13    │ 'PhantomOfTheLibrary' │   false   │ false │  89   │      'Python'      │
  └─────────┴───────────────────────┴───────────┴───────┴───────┴────────────────────┘
  ```
  </details>
