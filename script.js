
const APIURL = 'https://api.github.com/users/';
const username = document.querySelector('#userinput');

//function to get the user detail
async function getUserDetail(username) {
    try {
        let response = await fetch(APIURL + username);
        let data = await response.json();
        if (!response.ok) throw new Error('User not found or Invalid username')
        createUserCard(data);
        getRepos(username)

        const rateLimit = response.headers.get('X-RateLimit-Limit');
        const rateRemaining = response.headers.get('X-RateLimit-Remaining');
        const rateReset = response.headers.get('X-RateLimit-Reset');

        console.log(`Rate Limit: ${rateLimit}`);
        console.log(`Remaining Requests: ${rateRemaining}`);
        console.log(`Rate Limit Resets at: ${new Date(rateReset * 1000)}`);
    }
    catch (err) {
        console.error(err.message);
        showerror('Please enter a valid github username')
    }
}

//function to fetch the available repo
async function getRepos(username) {
    try {
        let response = await fetch(APIURL + username + '/repos');
        let repoData = await response.json();
        if (repoData.length == 0) throw new Error('No repositories available')
        if (!response.ok) throw new Error('Repos not found', response.status)
        addReposToCard(repoData)
    }
    catch (err) {
        console.error('Error:', err.message)
        repoError('No repositories available')
    }
}

//function to show the user details on the UI
function createUserCard(userdata) {
    let card = document.createElement('section')
    let main = document.querySelector('main')
    card.classList.add('card')
    const bio = userdata.bio || "This profile has no bio";
    const location = userdata.location || "No location provided";
    const name = userdata.name || "Github User";

    card.innerHTML = ` <div class="maindetail">
    <img src="${userdata.avatar_url}" alt="${userdata.name}" id="profile">
    <div class="userdetail">
        <h3 id="name">${name}</h3>
        <h3 id="username"><a href="${userdata.html_url}" target="_blank">@${userdata.login}</a></h3>
         </div>
         <div class="location-joined">
        <span>Joined   ${joinedDate(userdata.created_at)}</span>
        <p id="location">${location}</p>
        </div>
        </div>
        <p id="bio">${bio}</p>
<ul class="info">
    <li><strong>Followers</strong><span> ${userdata.followers}</span></li>
    <li><strong>Following</strong> <span>${userdata.following}</span></li>
    <li><strong>Repos</strong> <span>${userdata.public_repos}</span></li>
</ul>
<article class="repo"></article>
 `
    main.appendChild(card)
}

//function to show the repo details on the UI
function addReposToCard(repos) {
    let repositories = document.querySelector('.repo');
    let repolist = document.createElement('span');
    repolist.classList.add('repo-list-heading');
    repositories.appendChild(repolist);
    repolist.innerHTML = 'Repos Lists :'
    let listOfRepo = document.createElement('div');
    listOfRepo.classList.add('listOfRepo')
    repositories.appendChild(listOfRepo);
    repos.forEach(repo => {
        // console.log(repo);
        let repoEl = document.createElement('a');
        repoEl.href = repo.html_url;
        repoEl.innerText = repo.name;
        repoEl.target = '_blank'
        listOfRepo.appendChild(repoEl)
    })
}

//function to format the joined date
function joinedDate(date) {
    const join = new Date(date);
    const year = join.getFullYear()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[join.getMonth()];
    //padStart() method works on string.
    //takes 2 args(desiredLength,topadwith(default is space))
    const day = String(join.getDate()).padStart(2, '0');
    const formattedDate = `${year} ${month} ${day}`
    return formattedDate;
}

//function to search the user account
function searchdata() {
    username.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            userInput = e.target.value.trim();
            document.querySelector('main').innerHTML = '';
            getUserDetail(userInput)
        }
    })
}

//function to show the username error( if empty or invalid)
function showerror(message) {
    let main = document.querySelector('main')
    main.innerHTML = '';
    let error = document.createElement('span')
    error.classList.add('error')
    error.textContent = message
    main.appendChild(error)
    return;
}

//function to show the message (if no repo available)
function repoError(message) {
    let repolists = document.querySelector('.repo');
    repolists.innerHTML = message;
}

searchdata()
//initial (default) call
getUserDetail('theNooradeveloper');
