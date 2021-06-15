const allCells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('btn-restart');
const resultText = document.getElementById('result-text');
const turnText = document.querySelector('.current-player-message');
const resultPage = document.querySelector('.result-message');

const playerOne = {
    value: 'x',
    name: null
};
const playerTwo = {
    value: 'o',
    name: null
};
let currentPlayer;

// Players must enter their names to start (extra);
// A form page is shown, and it closes once the names are filled in. Then, the game starts.
const namesForm = document.querySelector('.player-info');
namesForm.addEventListener('submit', e => {
    e.preventDefault()
    const playerOneName = e.currentTarget.querySelector('#playerOne')
    const playerTwoName = e.currentTarget.querySelector('#playerTwo')
    playerOne.name = playerOneName.value
    playerTwo.name = playerTwoName.value
    if (playerOne.name && playerTwo.name) {
        const formPage = document.querySelector('.form')
        formPage.style.display = 'none'
        startGame()
    } else {
        alert('You must enter 2 player\'s name to start playing')
    }
});

// This function starts the game. It assigns the current player to playerOne.
// A message is shown every turn, so players know when it's their turn;
// I empty the cell ellements at the begining of every round;
// Result page is hidden (when the game is reset).
function startGame() {
    currentPlayer = playerOne
    turnText.innerText = `It'\s ${currentPlayer.name}'s turn`
    resultText.innerText = ''
    allCells.forEach(cell => {
        cell.innerText = ''
        cell.classList.remove('x', 'o')
        cell.addEventListener('click', handleClick, { once: true })
    })
    resultPage.style.display = 'none'
};

// This function switch turns between players after every turn;
// it shows a message to the players so they know their turn
function switchTurn() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    turnText.innerText = `It'\s ${currentPlayer.name}'s turn`
};

// This function handles clicks in a cell;
// it captures the event 'click' in a cell and write inside of it the value of the player's object (it can be either 'x' or 'o');
// it store the current player's value inside a variable to use it as a class in the html;
// then I check if there's a winner, if so the game is over and the winner's name is shown in the result page;
// if not, I check if it's a draw. If so, I finish the game and show the result page;
// if none of the options above are true, I switch player's turn and continue the game.
function handleClick(event) {
    const cell = event.currentTarget
    cell.innerText = currentPlayer === playerOne ? playerOne.value : playerTwo.value
    const playerClass = currentPlayer.value
    cell.classList.add(playerClass)
    if (hasAWinner(playerClass)) {
        finishGame(false)
    } else if (isDraw()) {
        finishGame(true)
    } else {
        switchTurn()
    } 
};

// first I set all the possible winning combinations (horizontal, vertical and diagonal);
// then I check if there's one combination that in every index contains the same class (for that, I use the class added in the html);
// if the function is true, then we have a winner
function hasAWinner(playerClass) {
    const winningArrays = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    return winningArrays.some(combination => {
        return combination.every(index => {
            return allCells[index].classList.contains(playerClass)
        })
    })
};

// if every cell has a class but it does not corresponde to the winning combinations, then it's a draw
function isDraw() {
    return [...allCells].every(cell => {
        return cell.classList.contains(playerOne.value) || cell.classList.contains(playerTwo.value)
    })
}

// if draw is true, the game is over, we get a message and remove event listener so players can no longer play;
// if draw is false, the game is over, winner's name is shown and event listener is removed
function finishGame(draw) {
    if (draw) {
        resultPage.style.display = 'flex'
        resultText.innerText = 'It\'s a draw!'
        allCells.forEach(cell => {
            cell.removeEventListener('click', handleClick)
        })
    } else {
        resultPage.style.display = 'flex'
        resultText.innerText = `${currentPlayer === playerOne ? playerOne.name : playerTwo.name } wins!`
        allCells.forEach(cell => {
            cell.removeEventListener('click', handleClick)
        })
    }
    
};

// restart button in the result page restart the game
restartButton.addEventListener('click', startGame);