let baseUrl = 'https://api.tvmaze.com/shows/';
const movieButton = document.querySelector('#movieButton');
const titleSpace = document.querySelector('#titleSpace');
const showImg = document.querySelector('#showImg');
const guessForm = document.querySelector('#guessForm');
const guessBoxes = document.querySelectorAll('.guessBox');
const seasonHint = document.querySelector('#seasonHint');
const episodeHint = document.querySelector('#episodeHint');
const seasonInput = document.querySelector('#seasonInput');
const episodeInput = document.querySelector('#episodeInput');
const submitButton = document.querySelector('#submit');
const resetButton = document.querySelector('#reset');
const sBox = document.querySelector('#sBox');
const eBox = document.querySelector('#eBox');

let guesses = 0;
const MAX_GUESSES = 5;
let round = 1;
const MAX_ROUNDS = 3;
let activeUrl;

const randUrl = function (baseUrl) {
    let randNum = Math.floor(Math.random() * 2000) + 1;
    baseUrl += randNum.toString();
    return baseUrl;
};
activeUrl = randUrl(baseUrl);
const getData = async () => {
    const res = await fetch(activeUrl);
    const showData = await res.json();
    return showData;
};
const getNext = async (addOn) => {
    const res = await fetch(activeUrl + addOn);
    const addOnData = await res.json();
    return addOnData;
};
const roundDisplay = function () {
    const roundDisplay = document.querySelector('#roundDisplay');
    roundDisplay.innerText = round;
}
const displayTitle = async function () {
    guessForm.classList.toggle('none');
    movieButton.style.display = 'none';
    if (round > 1) {
        activeUrl = randUrl(baseUrl);
        clean();
    }
    const showData = await getData(activeUrl);
    roundDisplay();
    titleSpace.innerText = showData.name;
    showImg.src = showData.image.medium;

};
const tickGuess = function (state) {
    if (state) {
        guessBoxes[guesses].style.backgroundColor = 'green';
    }
    else {
        guessBoxes[guesses].style.backgroundColor = 'red';
    }
}
const reset = function () {
    clean();
    movieButton.innerText = 'Get Show';
    movieButton.style.display = 'inline';
    round = 1;
    guessForm.classList.toggle('none');
    titleSpace.innerText = 'Get Show';
    showImg.src = './images/free-vector-blue-texture-halftone-background.jpg';
    activeUrl = randUrl(baseUrl);
};
const clean = function () {
    for (let guess of guessBoxes) {
        guess.style.backgroundColor = 'rgb(172, 172, 172)';
    }
    guesses = 0;
    seasonInput.style.borderColor = 'rgb(0, 164, 176)';
    episodeInput.style.borderColor = 'rgb(0, 164, 176)';
    seasonHint.style.backgroundColor = 'rgb(172, 172, 172)';
    episodeHint.style.backgroundColor = 'rgb(172, 172, 172)';
    seasonInput.value = '';
    episodeInput.value = '';
    seasonHint.innerText = 'S';
    episodeHint.innerText = 'E';
    seasonInput.placeholder = 'Seasons';
    episodeInput.placeholder = 'Episodes';
    submitButton.disabled = false;
};
const hint = function (value, zone) {
    if (!value) {
        zone.innerText = '+';
    }
    else {
        zone.innerText = '-';
    }
}

const guessLogic = (seasons, episodes) => {
    let winningGuess = false;
    if (seasonInput.value == seasons && episodeInput.value == episodes) {
        seasonInput.style.borderColor = 'green';
        episodeInput.style.borderColor = 'green';
        return true;
    }
    if (seasonInput.value == seasons) {
        seasonInput.style.borderColor = 'green';
        seasonHint.innerText = '';
        seasonHint.style.backgroundColor = 'green';
    }
    else {
        if (seasonInput.value < seasons) {
            hint(false, seasonHint);
            if (parseInt(seasonInput.value) + 1 == seasons) {
                seasonInput.style.borderColor = 'yellow';
            }
            else {
                seasonInput.style.borderColor = 'red';
            }
        }
        else {
            hint(true, seasonHint);
            if (parseInt(seasonInput.value) - 1 == seasons) {
                seasonInput.style.borderColor = 'yellow';
            }
            else {
                seasonInput.style.borderColor = 'red';
            }
        }
    }
    if (episodeInput.value == episodes) {
        episodeInput.style.borderColor = 'green';
        episodeHint.innerText = '';
        episodeHint.style.backgroundColor = 'green';
    }
    else {
        if (episodeInput.value < episodes) {
            hint(false, episodeHint);
            if (parseInt(episodeInput.value) + 1 == episodes) {
                episodeInput.style.borderColor = 'yellow';
            }
            else {
                episodeInput.style.borderColor = 'red';
            }
        }
        else {
            hint(true, episodeHint);
            if (parseInt(episodeInput.value) - 1 == episodes) {
                episodeInput.style.borderColor = 'yellow';
            }
            else {
                episodeInput.style.borderColor = 'red';
            }
        }
    }
    return winningGuess;
};

movieButton.addEventListener('click', displayTitle);
guessForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const seasonData = await getNext('/seasons');
    const episodeData = await getNext('/episodes');
    let seasons = seasonData.length;
    let episodes = episodeData.length;
    sBox.innerText = seasons;
    eBox.innerText = episodes;
    let winCon = guessLogic(seasons, episodes);
    if (winCon == true) {
        guessForm.classList.toggle('none');
        movieButton.style.display = 'inline';
        submitButton.disabled = true;
        movieButton.disabled = false;
        movieButton.innerText = "Next Show";
        titleSpace.innerText = `WON ROUND ${round}`;
        round++;
        if (round > MAX_ROUNDS) {
            movieButton.disabled = true;
            titleSpace.innerText = `WON ${round - 1} ROUNDS. GAME OVER`;
        }
    }
    tickGuess(winCon);
    guesses++;
    if (guesses == MAX_GUESSES && !winCon) {
        submitButton.disabled = true;
        titleSpace.innerText = 'YOU LOSE. TRY AGAIN';
    }
});
resetButton.addEventListener('click', reset);

sBox.addEventListener('click', () => {
    sBox.classList.toggle('showAnswer');
});
eBox.addEventListener('click', () => {
    eBox.classList.toggle('showAnswer');
});
