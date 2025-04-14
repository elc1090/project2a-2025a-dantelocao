const gitHubForm = document.getElementById('gitHubForm');
//const token = ''; chave github

gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let usernameInput = document.getElementById('usernameInput');
    let repoNameInput = document.getElementById('userRepoInput');
    let gitHubUsername = usernameInput.value;
    let gitHubRepoName = repoNameInput.value;

    requestUserRepos(gitHubUsername)
        .then(response => response.json())
        .then(data => {
            let ul = document.getElementById('userRepos');
            ul.innerHTML = '';

            if (data.message === "Not Found") {
                let li = document.createElement('li');
                li.classList.add('list-group-item');
                li.innerHTML = `<p><strong>No account exists with username:</strong> ${gitHubUsername}</p>`;
                ul.appendChild(li);
                return;
            }

            if (gitHubRepoName) {
                // Busca repositório específico
                requestUserRepoByName(gitHubUsername, gitHubRepoName)
                    .then(response => response.json())
                    .then(data_repo => {
                        // Cria o li principal
                        let repoLi = document.createElement('li');
                        repoLi.classList.add('list-group-item');
                        repoLi.innerHTML = (`
                            <p><strong>Repo:</strong> ${data_repo.name}</p>
                            <p><strong>Description:</strong> ${data_repo.description}</p>
                            <p><strong>URL:</strong> <a href="${data_repo.html_url}" target="_blank">${data_repo.html_url}</a></p>
                            <p><strong>Commits:</strong></p>
                        `);

                        // Cria uma sublista para os commits
                        const commitsUl = document.createElement('ul');
                        commitsUl.classList.add('list-group', 'mt-3');

                        // Busca os commits
                        requestCommitsUserRepo(gitHubUsername, gitHubRepoName)
                            .then(response => response.json())
                            .then(data_repoCommits => {
                                data_repoCommits.forEach(commitObj => {
                                    const mensagem = commitObj.commit.message;
                                    const autor = commitObj.commit.author.name;
                                    const data = commitObj.commit.author.date;
                                    const url = commitObj.html_url;

                                    let commitLi = document.createElement('li');
                                    commitLi.classList.add('list-group-item');
                                    commitLi.innerHTML = (`
                                        <p><strong>Commit:</strong> <a href="${url}" target="_blank">${mensagem}</a></p>
                                        <p><strong>Autor:</strong> ${autor}</p>
                                        <p><strong>Data:</strong> ${new Date(data).toLocaleString()}</p>
                                    `);
                                    commitsUl.appendChild(commitLi);
                                });

                                // Adiciona sublista ao li principal e o li à lista
                                repoLi.appendChild(commitsUl);
                                ul.appendChild(repoLi);
                            })
                            .catch(error => console.error("Erro ao buscar commits:", error));
                    })
                    .catch(error => console.error("Erro ao buscar repositório:", error));
            } else {
                // Lista todos os repositórios do usuário
                data.forEach(repo => {
                    let li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.innerHTML = (`
                        <p><strong>Repo:</strong> ${repo.name}</p>
                        <p><strong>Description:</strong> ${repo.description}</p>
                        <p><strong>URL:</strong> <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></p>
                    `);
                    ul.appendChild(li);
                });
            }
        })
        .catch(error => console.error("Erro ao buscar repositórios do usuário:", error));
});

// --- Funções de API com autenticação ---
function requestUserRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos`, {
        headers: { 'Authorization': `token ${token}` }
    });
}

function requestUserRepoByName(username, repoName) {
    return fetch(`https://api.github.com/repos/${username}/${repoName}`, {
        headers: { 'Authorization': `token ${token}` }
    });
}

function requestCommitsUserRepo(username, repoName) {
    return fetch(`https://api.github.com/repos/${username}/${repoName}/commits`, {
        headers: { 'Authorization': `token ${token}` }
    });
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