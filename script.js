const player = (nam, dat, col) => {

    let name = nam;
    let data = dat;
    let color = col;

    const setName = function (string) {
        name = string;
    }

    const setData = function (string) {
        data = string;
    }

    const setColor = function (string) {
        color = string;
    }

    const getColor = function () {
        return color;
    }

    const getData = function () {
        return data;
    }
    
    const getName = function () {
        return name;
    }
 
    return { setName, setData, setColor, getColor, getData, getName}

}

let one, two

let gameBoard = (function () {

    let cells = Array.from(document.getElementsByClassName('cell'));

    function clickOnCell(index, data) {
        if (cells[index].textContent == ''){
            cells[index].textContent = data;
            changeColor(index, gameFlow.getColor(), gameFlow.getPlayer());
            gameFlow.setTurns(one, two);
        }  
    }

    for (let i=0; i<cells.length; i++) {
        cells[i].addEventListener('click', checkIndex);
    }

    function checkIndex (e) {
        let index = cells.indexOf(e.path[0]);
        clickOnCell(index, gameFlow.getData());
        gameFlow.checkWinner();
    } 

    function changeColor (index, data, name) {
        cells[index].style.color = data;
        cells[index].dataset.name = name;
    }

    function clearBoard() {
        for (let i=0; i<cells.length; i++){
        cells[i].textContent = '';
        cells[i].disabled = false;
        }
    }

    function getCells () {
        return cells;
    }

    function checkBoardIsFull () {
        for (let i=0; i<cells.length; i++){
            if (cells[i].textContent != '') {}
            else return false;
        }
        return true;
    }

    function disableBoard () {
        for (let i=0; i<cells.length; i++) {
            cells[i].disabled = true;
        }
    }

    return {
        clearBoard, getCells, checkBoardIsFull, disableBoard
    }
})();

let gameDisplay = (function () {
    let p1 = document.querySelector('#p1');
    let p2 = document.querySelector('#p2');
    let score = document.querySelector('#score');
    let gameDiv = document.querySelector('#game');

    function displayPlayers (player1, player2) {
        p1.childNodes[0].textContent = player1.getName();
        p2.childNodes[0].textContent = player2.getName();
    }

    function highlightPlayer (name, color) {
        if (p1.childNodes[0].textContent == name) {
            p1.classList.add('active');
            p1.style = `border: 1px solid ${color}`;
        }
        else {
            p1.classList.remove('active');
            p1.style = '';
        }
        if (p2.childNodes[0].textContent == name) {
            p2.classList.add('active');
            p2.style = `border: 1px solid ${color}`;
        }
        else {
            p2.classList.remove('active');
            p2.style = '';
        }
    }

    function stopHighlight () {
        p1.classList.remove('active');
        p1.style = '';
        p2.classList.remove('active');
        p2.style = '';
    }

    function updateWinner (winner) {
        if (winner != null && winner != 'noWinner') score.childNodes[0].textContent =`The winner is ${winner}`;
        else if (winner == 'noWinner') score.childNodes[0].textContent = `It's a tie. There is no winner`;
        else score.childNodes[0].textContent = '';
    }

    function updateScore (string) {
        score.childNodes[1].textContent = string;
    }

    function displayGame () {
        gameDiv.classList.add('active');
        gameBoard.clearBoard();
    }

    return {
        highlightPlayer, updateWinner, stopHighlight, updateScore, displayGame, displayPlayers
    }
})();

let gameFlow = (function (){

    let count = 0;
    let data;
    let color;
    let name;
    let winner;
    let currentGame = 0;
    let totalGames = [];

    function increaseCount () {
        count++;
    }

    function setTurns (player1, player2) {
        increaseCount();
        if (currentGame%2 == 0) {
            if (count%2 == 0) {
                getPlayerData(player1);
            }
            else {
                getPlayerData(player2);
            }
        }
        else {
            if (count%2 == 0) {
                getPlayerData(player2);
            }
            else {
                getPlayerData(player1);
            }
        }
        gameDisplay.highlightPlayer(name, color);
    }

    function getPlayerData (player) {
        data = player.getData();
        color = player.getColor();
        name = player.getName();
    }

    function getData () {
        return data;
    }

    function getColor () {
        return color;
    }

    function getPlayer () {
        return name
    }

    function setFirstTurn (player1) {
        getPlayerData(player1);
        gameDisplay.highlightPlayer(name, color);
        count = 0;
    }

    function checkWinner () {
        if (count > 4) {
            let cells = gameBoard.getCells();
            checkRows(cells);
            checkColums(cells);
            checkCross(cells);
            stopGame(cells);
        }
    }

    function checkRows (cells) {
        for (let i = 0; i<9; i++) {
            checkLine(cells[i], cells[i+1], cells[i+2]);
            i+=2;
        }
    }

    function checkColums (cells) {
        for (let i = 0; i<3; i++) {
            checkLine(cells[i], cells[i+3], cells[i+6]);
        }
    }

    function checkCross(cells) {
        checkLine(cells[0], cells[4], cells[8]);
        checkLine(cells[2], cells[4], cells[6]);
    }

    function stopGame (cells) {
        if (winner == one.getName() || winner == two.getName() || gameBoard.checkBoardIsFull()) {
            if (winner == one.getName() || winner == two.getName()){
                for (let i=0; i<cells.length; i++){
                    cells[i].disabled = true;
                }
                totalGames[currentGame] = winner;
                currentGame++;
                checkMatchWinner ();
            }
            else {
                winner = 'noWinner';                
            }
            gameDisplay.updateWinner(winner);
            gameDisplay.stopHighlight();
        }
    }

    function checkLine (c1, c2, c3) {
        if (c1.dataset.name == c2.dataset.name && c2.dataset.name == c3.dataset.name) {
            if (c1.dataset.name == one.getName()) winner = one.getName(); 
            if (c1.dataset.name == two.getName()) winner = two.getName();                        
        }
    }

    function restartGame() {
        count = 0;
        gameBoard.clearBoard();
        if (currentGame%2 == 0) 
        setFirstTurn(one);
        else
        setFirstTurn (two)
        winner = null;
        gameDisplay.updateWinner(winner);
    }

    function setMatch (num) {
        totalGames = [];
        buttons.activateRestartGame();
        for (let i = 0; i < num; i++)
        totalGames[i] = '';
        currentGame = 0;
        gameDisplay.updateScore(`${one.getName()}: 0 ${two.getName()}: 0`);
    }

    function restartMatch () {
        setMatch(totalGames.length);
        restartGame();
    }

    function checkMatchWinner () {
        let p1Score = 0;
        let p2Score = 0;
        for (let i = 0; i<currentGame; i++){
            if (one.getName() == totalGames[i]) p1Score++;
            else p2Score++;
        }
        if (p1Score > totalGames.length/2 || p2Score > totalGames.length/2){
            if (p1Score > p2Score) gameDisplay.updateScore(`${one.getName()} has won the match!`);
            else gameDisplay.updateScore(`${two.getName()} has won the match!`);
            gameBoard.disableBoard();
            buttons.disableRestartGame();
        }
        else gameDisplay.updateScore(`${one.getName()}: ${p1Score} ${two.getName()}: ${p2Score}`); 
    }

    return {
        setTurns, getData, getColor, getPlayer, checkWinner, restartGame, restartMatch, setFirstTurn, setMatch
    }
})();

let buttons = (function () {
    const reGame = document.querySelector('#restart-game');
    const reMatch = document.querySelector('#restart-match');

    reGame.addEventListener('click', gameFlow.restartGame);
    reMatch.addEventListener('click', gameFlow.restartMatch);

    function disableRestartGame() {
        reGame.disabled = true;
    }

    function activateRestartGame() {
        reGame.disabled = false;
    }

    return {
        disableRestartGame, activateRestartGame
    }
})();

let settings = (function () {
    const menu = document.querySelector('#settings');
    const start = document.querySelector('#start');
    const inputs = Array.from(document.querySelectorAll('#settings input'));
    const instructions = Array.from(document.getElementsByClassName('instructions'));
    const slider = document.querySelector('input[type=range]');
    const matches = document.querySelector('#setup p');
    const edit = document.querySelector('#edit');
    const confirmation = document.querySelector('#confirmation');
    const background = document.querySelector('#background');
    const confirm = document.querySelector('#confirm');
    const cancel = document.querySelector('#cancel');

    start.addEventListener('click', shrinkSettings);
    slider.addEventListener('input', updateMatches);
    edit.addEventListener('click', enableEdit);
    confirm.addEventListener('click', newMatch);

    cancel.addEventListener('click', cancelSettings);
    background.addEventListener('click', cancelSettings);

    let previousSettings = [];

    for(let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', () => checkInputValidity(i));
    }

    function shrinkSettings() {
        if (menu.checkValidity()) {
            menu.classList.add('side');
            disableInputs();
            gameDisplay.displayGame();
            startGame();
        }
        else checkFormValidity();
    }

    function startGame () {
        one = player(inputs[0].value, inputs[1].value, inputs[2].value);
        two = player(inputs[3].value, inputs[4].value, inputs[5].value);
        gameDisplay.displayPlayers(one, two)
        gameFlow.setMatch(slider.value);
        gameFlow.setFirstTurn(one);
    }

    function checkFormValidity () {
        for (let i = 0; i < inputs.length; i++) checkInputValidity (i);
    }

    function checkInputValidity (i) {   
        if (!inputs[i].validity.valid) instructions[i].classList.add('active');
        else instructions[i].classList.remove('active');
    }

    function updateMatches () {
        matches.textContent = `Number of Matches: ${slider.value}`;
    }

    function disableInputs () {
        for(let i=0; i<inputs.length; i++) inputs[i].disabled = true;
    }

    function enableInputs () {
        for(let i=0; i<inputs.length; i++) inputs[i].disabled = false;
    }

    function enableEdit() {
        if (edit.textContent == 'Edit') {
            for (let i = 0; i<inputs.length; i++) previousSettings[i] = inputs[i].value;
            enableInputs();
            edit.textContent = 'Confirm';
        }
        else if (menu.checkValidity()) {
            let inputsChanged = false;
            for (let i=0; i<inputs.length; i++) {
                if (previousSettings[i] != inputs[i].value){
                    inputsChanged = true;
                    break;
                }
            }
            if (inputsChanged == true) {
                displayConfirm();
            }
            disableInputs();
            edit.textContent = 'Edit';
        }
    }

    function displayConfirm () {
        confirmation.classList.add('active');
        background.classList.add('active');
    }

    function newMatch () {
        gameFlow.restartGame();
        disableInputs();
        hideConfirm();
        startGame();
    }

    function hideConfirm () {
        confirmation.classList.remove('active');
        background.classList.remove('active');
    }

    function cancelSettings () {
        hideConfirm();
        for (let i=0; i<previousSettings.length; i++) inputs[i].value = previousSettings[i];
        updateMatches();
    }

    return {
        shrinkSettings
    }
})();



