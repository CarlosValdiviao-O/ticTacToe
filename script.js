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

let one = player('one', 'x', '#309797');
let two = player('two', 'r', 'blue');

let gameBoard = (function () {

    let cells = Array.from(document.getElementsByClassName('cell'));

    function clickOnCell(index, data) {
        if (cells[index].textContent == ''){
            cells[index].textContent = data;
            changeColor(index, gameFlow.getColor());
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

    function changeColor (index, data) {
        cells[index].style = `color: ${data}`;
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

    function displayPlayers (player1, player2) {
        p1.firstChild.textContent = player1.getName();
        p2.firstChild.textContent = player2.getName();
    }

    function highlightPlayer (name, color) {
        if (p1.firstChild.textContent == name) {
            p1.classList.add('active');
            p1.style = `border: 1px solid ${color}`;
        }
        else {
            p1.classList.remove('active');
            p1.style = '';
        }
        if (p2.firstChild.textContent == name) {
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
        if (winner != null && winner != 'noWinner') score.firstChild.textContent =`The winner is ${winner}`;
        else if (winner == 'noWinner') score.firstChild.textContent = `It's a tie. There is no winner`;
        else score.firstChild.textContent = '';
    }

    function updateScore (string) {
        score.lastChild.textContent = string;
    }

    displayPlayers(one, two);

    return {
        highlightPlayer, updateWinner, stopHighlight, updateScore
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
        if (c1.textContent == c2.textContent && c2.textContent == c3.textContent) {
            if (c1.textContent == one.getData()) winner = one.getName(); 
            if (c1.textContent == two.getData()) winner = two.getName();            
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
        for (let i = 0; i < num; i++)
        totalGames[i] = '';
        currentGame = 0;
        gameDisplay.updateScore(`${one.getName()}: 0 ${two.getName()}: 0`);
    }

    function restartMatch () {
        setMatch(totalGames.length);
        buttons.activateRestartGame();
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

    setMatch (5);
    setFirstTurn(one);

    return {
        setTurns, getData, getColor, checkWinner, restartGame, restartMatch
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



