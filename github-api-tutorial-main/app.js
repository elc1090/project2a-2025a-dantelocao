// Get the GitHub username input form
const gitHubForm = document.getElementById('gitHubForm');
//const token = ''; chave github

// Listen for submissions on GitHub username input form
gitHubForm.addEventListener('submit', (e) => {

    // Prevent default form submission action
    e.preventDefault();

    // Get the GitHub username and repoName input field on the DOM
    let usernameInput = document.getElementById('usernameInput');
    let repoNameInput = document.getElementById('userRepoInput');

    // Get the value of the GitHub username input field
    let gitHubUsername = usernameInput.value;
    let gitHubRepoName = repoNameInput.value;

    // Run GitHub API function, passing in the GitHub username
    requestUserRepos(gitHubUsername)
        .then(response => response.json()) // parse response into json
        .then(data => {
            // update html with data from github
            for (let i in data) {
                // Get the ul with id of userRepos

                if (data.message === "Not Found") {
                    let ul = document.getElementById('userRepos');

                    // Create variable that will create li's to be added to ul
                    let li = document.createElement('li');

                    // Add Bootstrap list item class to each li
                    li.classList.add('list-group-item')
                    // Create the html markup for each li
                    li.innerHTML = (`
                <p><strong>No account exists with username:</strong> ${gitHubUsername}</p>`);
                    // Append each li to the ul
                    ul.appendChild(li);
                } else {

                    let ul = document.getElementById('userRepos');

                    if (gitHubRepoName) {

                        requestUserRepoByName(gitHubUsername, gitHubRepoName)
                        .then(response => response.json()) // parse response into json
                        .then(data_repo => {
                          console.log(data_repo.name); // aqui imprime o retorno da API
                          console.log(data_repo.description); // aqui imprime o retorno da API
                          console.log(data_repo.stargazers_count); // aqui imprime o retorno da API
                          console.log(data_repo.forks_count); // aqui imprime o retorno da API


                        })
                        .catch(error => {
                          console.error("Erro ao buscar o repositório:", error);
                        });
                        
                    } else {
                       

                        // Create variable that will create li's to be added to ul
                        let li = document.createElement('li');

                        // Add Bootstrap list item class to each li
                        li.classList.add('list-group-item')

                        // Create the html markup for each li
                        li.innerHTML = (`
                            <p><strong>Repo:</strong> ${data[i].name}</p>
                            <p><strong>Description:</strong> ${data[i].description}</p>
                            <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
                        `);

                        // Append each li to the ul
                        ul.appendChild(li);
                    }
                }
            }
        })
})

function requestUserRepos(username) {
    // create a variable to hold the `Promise` returned from `fetch`
    return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`,
        {
            headers: {
                'Authorization': `token ${token}`
            }
        }
    ));
}


function requestUserRepoByName(username, repoName) {
    // create a variable to hold the `Promise` returned from `fetch`
    return Promise.resolve(fetch(`https://api.github.com/repos/${username}/${repoName}`,
        {
            headers: {
                'Authorization': `token ${token}`
            }
        }
    ));
}