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

let one = player('one', 'x', 'red');
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

    return {
        clearBoard, getCells, checkBoardIsFull
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

    function highlightPlayer (name) {
        if (p1.firstChild.textContent == name) p1.classList.add('active');
        else p1.classList.remove('active');
        if (p2.firstChild.textContent == name) p2.classList.add('active');
        else p2.classList.remove('active');
    }

    function stopHighlight () {
        p1.classList.remove('active');
        p2.classList.remove('active');
    }

    function updateWinner (winner) {
        if (winner != null && winner != 'noWinner') score.firstChild.textContent =`The winner is ${winner}`;
        else if (winner == 'noWinner') score.firstChild.textContent = `It's a tie. There is no winner`;
        else score.firstChild.textContent = '';
    }

    displayPlayers(one, two);

    return {
        highlightPlayer, updateWinner, stopHighlight
    }
})();

let gameFlow = (function (){

    let count = 0;
    let data
    let color
    let name
    let winner

    function increaseCount () {
        count++;
    }

    function setTurns (player1, player2) {
        increaseCount();
        if (count%2 == 0) {
            getPlayerData(player1);
        }
        else {
            getPlayerData(player2);
        }
        gameDisplay.highlightPlayer(name);
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

    function logCount () {
        console.log (count);
    }

    function setFirstTurn (player1) {
        getPlayerData(player1);
        gameDisplay.highlightPlayer(name);
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
        if (winner == one.getName() || winner == two.getName()) {
            for (let i=0; i<cells.length; i++){
                cells[i].disabled = true;
            }
            gameDisplay.updateWinner(winner);
            gameDisplay.stopHighlight();
        }
        else if (gameBoard.checkBoardIsFull()){
            winner = 'noWinner';
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
        setFirstTurn(one);
        winner = null;
        gameDisplay.updateWinner(winner);
    }

    setFirstTurn(one);

    return {
        setTurns, getData, getColor, logCount, checkWinner, restartGame
    }
})();

let buttons = (function () {
    const reGame = document.querySelector('#restart-game');
    const reMatch = document.querySelector('#restart-match');

    reGame.addEventListener('click', gameFlow.restartGame);
})();



