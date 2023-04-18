const player = (nam, dat, col, brai, lvl) => {

    let name = nam;
    let data = dat;
    let color = col;
    let brain = brai;
    let level = lvl;

    const setName = function (string) {
        name = string;
    }

    const setData = function (string) {
        data = string;
    }

    const setColor = function (string) {
        color = string;
    }

    const setBrain = function (string) {
        brain = string;
    }

    const setLevel = function (string) {
        level = string;
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

    const getBrain = function () {
        return brain;
    }

    const getLevel = function () {
        return level;
    }
 
    return { 
        setName, setData, setColor, setBrain, setLevel,
        getColor, getData, getName, getBrain, getLevel
    }

}

let one, two

let gameBoard = (function () {

    let cells = Array.from(document.getElementsByClassName('cell'));
    let circles = Array.from(document.getElementsByClassName('circle'));
    let circleGrid = document.querySelector('#circles')

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
        let index = cells.indexOf(e.target);
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
        cells[i].dataset.name = null;
        circles[i].style = 'border: 0px';
        }
        circleGrid.classList.remove('active');
    }

    function activateCircles() {
        circleGrid.classList.add('active');
    }

    function getCells () {
        return cells;
    }
    function getCircles () {
        return circles;
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

    function enableBoard () {
        for (let i=0; i<cells.length; i++) {
            cells[i].disabled = false;
        }
    }

    return {
        clearBoard, getCells, getCircles, checkBoardIsFull,
        disableBoard, enableBoard, activateCircles
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
                letComputerPlay(player1, player2);
            }
            else {
                getPlayerData(player2);
                letComputerPlay(player2, player1);
            }
        }
        else {
            if (count%2 == 0) {
                getPlayerData(player2);
                letComputerPlay(player2, player1);
            }
            else {
                getPlayerData(player1);
                letComputerPlay(player1, player2);
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
            checkLine(i, i+1, i+2, cells);
            i+=2;
        }
    }

    function checkColums (cells) {
        for (let i = 0; i<3; i++) {
            checkLine(i, i+3, i+6, cells);
        }
    }

    function checkCross(cells) {
        checkLine(0, 4, 8, cells);
        checkLine(2, 4, 6, cells);
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
                computer.stopComputer();                
            }
            gameDisplay.updateWinner(winner);
            gameDisplay.stopHighlight();
            
        }
    }

    function checkLine (i1, i2, i3, cells) {
        let circles = gameBoard.getCircles();
        if (cells[i1].dataset.name == cells[i2].dataset.name && cells[i2].dataset.name == cells[i3].dataset.name) {
            if (cells[i1].dataset.name == one.getName()){
                winner = one.getName();
                circles[i1].style = `border: 5px solid ${one.getColor()}`;
                circles[i2].style = `border: 5px solid ${one.getColor()}`;
                circles[i3].style = `border: 5px solid ${one.getColor()}`;
                gameBoard.activateCircles();
                computer.stopComputer();
            }  
            if (cells[i1].dataset.name == two.getName()) {
                winner = two.getName();
                circles[i1].style = `border: 5px solid ${two.getColor()}`;
                circles[i2].style = `border: 5px solid ${two.getColor()}`;
                circles[i3].style = `border: 5px solid ${two.getColor()}`;
                gameBoard.activateCircles();
                computer.stopComputer();
            }                         
        }
    }

    function restartGame() {
        count = 0;
        gameBoard.clearBoard();
        if (currentGame%2 == 0) {
            setFirstTurn(one);
            letComputerPlay(one, two);
        }
        else{
            setFirstTurn (two);
            letComputerPlay(two, one);
        }
        
        winner = null;
        gameDisplay.updateWinner(winner);
        computer.startComputer(); 
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

    function getWinner () {
        return winner;
    }

    function letComputerPlay (player, player2) {
        if (player.getBrain() == 'ai'){
            gameBoard.disableBoard();
            setTimeout( () => {
                let run = computer.play(player, player2);
                if (run) {
                    setTurns(one, two); 
                    gameBoard.enableBoard();
                    if (getWinner != '') checkWinner();
                }
                }, 500);      
        }
    }

    return {
        setTurns, getData, getColor, getPlayer, checkWinner,
        restartGame, restartMatch, setFirstTurn, setMatch,
        getWinner
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
    const selects = Array.from(document.querySelectorAll('select'));
    const instructions = Array.from(document.getElementsByClassName('instructions'));
    const slider = document.querySelector('input[type=range]');
    const matches = document.querySelector('#setup p');
    const edit = document.querySelector('#edit');
    const confirmation = document.querySelector('#confirmation');
    const background = document.querySelector('#background');
    const confirm = document.querySelector('#confirm');
    const cancel = document.querySelector('#cancel');
    const level = Array.from(document.getElementsByClassName('level'));

    start.addEventListener('click', shrinkSettings);
    slider.addEventListener('input', updateMatches);
    edit.addEventListener('click', enableEdit);
    confirm.addEventListener('click', newMatch);
    selects[0].addEventListener('change', displayDifficulty);
    selects[2].addEventListener('change', displayDifficulty);
    inputs[0].addEventListener('input', checkSameNames);
    inputs[3].addEventListener('input', checkSameNames);

    cancel.addEventListener('click', cancelSettings);
    background.addEventListener('click', cancelSettings);

    let previousSettings = [];

    for(let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', () => checkInputValidity(i));
    }

    function shrinkSettings() {
        if (checkSameNames()) return;
        if (menu.checkValidity()) {
            menu.classList.add('side');
            disableInputs();
            gameDisplay.displayGame();
            startGame();
        }
        else checkFormValidity();
    }

    function startGame () {
        one = player(inputs[0].value, inputs[1].value, inputs[2].value, selects[0].value, selects[1].value);
        two = player(inputs[3].value, inputs[4].value, inputs[5].value, selects[2].value, selects[3].value); 
        computer.startComputer();
        gameDisplay.displayPlayers(one, two)
        gameFlow.setMatch(slider.value);
        gameFlow.restartGame();
    }

    function checkFormValidity () {
        for (let i = 0; i < inputs.length; i++) checkInputValidity (i);
        
    }

    function checkInputValidity (i) {   
        if (!inputs[i].validity.valid) instructions[i].classList.add('active');
        else instructions[i].classList.remove('active');
    }

    function checkSameNames() {
        if (inputs[0].value == inputs[3].value) {
            instructions[6].classList.add('active');
            return true;
        }
        else {
            instructions[6].classList.remove('active');
            return false;
        }
    }

    function updateMatches () {
        matches.textContent = `Number of Matches: ${slider.value}`;
    }

    function disableInputs () {
        for(let i=0; i<inputs.length; i++){
            inputs[i].disabled = true;
            inputs[i].style.cursor = 'default';
        }
        for (let i = 0; i <selects.length; i++) {
            selects[i].disabled = true;
            selects[i].style.cursor = 'default';
        }
    }

    function enableInputs () {
        for(let i=0; i<inputs.length; i++) {
            inputs[i].disabled = false;
            inputs[i].style.cursor = 'auto';
            if (i == 2 || i == 5 || i == 6)
            inputs[i].style.cursor = 'pointer';
        }
        for (let i = 0; i <selects.length; i++) {
            selects[i].disabled = false;
            selects[i].style.cursor = 'pointer';
        }
    }

    function enableEdit() {
        if (edit.textContent == 'Edit') {
            for (let i = 0; i<inputs.length; i++) previousSettings[i] = inputs[i].value;
            for (let i = 0; i <selects.length; i++) previousSettings[i+inputs.length] = selects[i].value;
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
            for (let i=0; i<selects.length; i++) {
                if (previousSettings[i+inputs.length] != selects[i].value){
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
        for (let i=0; i<selects.length; i++) selects[i].value = previousSettings[i+selects.length];
        updateMatches();
    }

    function displayDifficulty () {
        if (selects[0].value == 'human') level[0].classList.remove('active')
        else level[0].classList.add('active');
        if (selects[2].value == 'human') level[1].classList.remove('active')
        else level[1].classList.add('active');    
    }

    return {
        shrinkSettings
    }
})();

let computer = (function () {

    let pick
    let computerOn = false;
    let scores = [];
    let winner = '';

    function play (player, player2) {
        if (computerOn){
            setScores(player);
            if (player.getLevel() == 'easy')
            pickRandom(player);
            else
            intelligentMove(player, player2);    
            return true;
        } 
        else 
        return false;  
    }

    function pickRandom (player) {
        let available = false;
        let cells = gameBoard.getCells();
        for (let i = 0; i<cells.length; i++) {
            if (cells[i].textContent == '') {
                available = true;
                break;
            }
        }
        if (available == true) {
            pick = cells[Math.floor(Math.random()*9)];
            if (pick.textContent == '')
            fillCell(pick, player); 
            else pickRandom(player);      
        }    
    }

    function fillCell (pick, player) {      
        if (pick.textContent == '' ) {
            pick.style.color = player.getColor();
            pick.textContent = player.getData();
            pick.dataset.name = player.getName();
        }
    }

    function undo (pick) {      
            pick[0] = '';
            pick[1] = null;
    }

    function stopComputer () {
        computerOn = false;
    }

    function startComputer() {
        computerOn = true;
    }

    function intelligentMove(player, player2) {
        let cells = gameBoard.getCells();
        let bestScore = -Infinity;
        let best;
        let secondBest;
        let fakeBoard = createFakeBoard(cells);
        for (let i = 0; i<fakeBoard.length; i++) {
            if (fakeBoard[i][0] == '') {
                fillFakeCell(fakeBoard[i], player);
                let score = minimax(fakeBoard, false, player, player2);
                undo(fakeBoard[i]);
                if (score == 0){ 
                    secondBest = i;    
                }
                if (score > bestScore) {
                    bestScore = score;
                    best = i;
                }
            }
        } 
        if (player.getLevel() == 'hard') 
        fillCell(cells[best], player);
        else {
            if (secondBest == undefined) pickRandom(player);
            else
            fillCell(cells[secondBest], player);
        } 
        
    }

    function createFakeBoard (cells) {
        let fakeBoard = [];
        for (let i = 0; i<cells.length; i++) {
            fakeBoard[i] = [];
            fakeBoard[i][0] = cells[i].textContent;
            fakeBoard[i][1] = cells[i].dataset.name;  
        }
        return fakeBoard;
    }

    function minimax (fakeBoard, isMaximizing, player, player2) {
        checkWinner(fakeBoard);
        if (winner == '') {}
        else {
            let score = scores[scores.indexOf(winner)+1];
            winner = '';
            return score;
        }

        if (isMaximizing){
            let topScore = -Infinity;
            for (let i = 0; i<fakeBoard.length; i++) {
                if (fakeBoard[i][0] == '') {
                    fillFakeCell(fakeBoard[i], player);
                    let score = minimax(fakeBoard, false, player, player2);
                    undo(fakeBoard[i]);
                    if (score > topScore)
                    topScore = score;
                }
            }
            return topScore;
        }
        else{
            let topScore = Infinity;
            for (let i = 0; i<fakeBoard.length; i++) {
                if (fakeBoard[i][0] == '') {
                    fillFakeCell(fakeBoard[i], player2);
                    let score = minimax(fakeBoard, true, player, player2);
                    undo(fakeBoard[i]);
                    if (score < topScore)
                    topScore = score;
                }
            }
            return topScore;
        }
    }

    function fillFakeCell (pick, player) {
        pick[0] = player.getData();
        pick[1] = player.getName();
    }

    function setScores (player) {
        scores[0] = one.getName();
        scores[1] = 1;    
        scores[2] = two.getName();
        scores[3] = -1;
        scores[4] = 'noWinner';
        scores[5] = 0;
        if (player.getName() == two.getName()) {
            scores[1] = -1;
            scores[3] = 1;
        }
    } 

    function checkWinner (cells) {
        if (winner == '') {
            checkRows(cells);
            checkColums(cells);
            checkCross(cells); 
            isFull(cells);
        } 
    }

    function checkRows (cells) {
        for (let i = 0; i<9; i++) {
            checkLine(i, i+1, i+2, cells);
            i+=2;
        }
    }

    function checkColums (cells) {
        for (let i = 0; i<3; i++) {
            checkLine(i, i+3, i+6, cells);
        }
    }

    function checkCross(cells) {
        checkLine(0, 4, 8, cells);
        checkLine(2, 4, 6, cells);
    }

    function isFull (cells) {
        let available = false;
        for (let i = 0; i<cells.length; i++) {
            if (cells[i][0] == '') {
                available = true;
                break;
            }
        }
        if (available != true && winner == '') {
            winner = 'noWinner';
        }
    }

    function checkLine (i1, i2, i3, cells) {
        if (cells[i1][1] == cells[i2][1] && cells[i2][1] == cells[i3][1]) {
            if (cells[i1][1] == one.getName() && winner == ''){
                winner = one.getName();
            }  
            if (cells[i1][1] == two.getName() && winner == '') {
                winner = two.getName();
            }                     
        }
    }

    return {
        play, stopComputer, startComputer, checkWinner
    }
})();
