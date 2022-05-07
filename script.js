const Player = (one, two, three) => {

    let name = one;
    let data = two;
    let color = three;

    function setName (string) {
        name = string;
    }

    function setData (string) {
        data = string;
    }

    function setColor (string) {
        color = string;
    }

    function getColor () {
        return color;
    }

    function getData () {
        return data;
    }
 
    return { setName, setData, setColor, getColor, getData}
}

let one = Player('one', 'x', 'red');
let two = Player('two', 'r', 'blue');

let gameBoard = (function () {

    let cells = Array.from(document.getElementsByClassName('cell'));

    function clickOnCell(index, data) {
        if (cells[index].textContent == ''){
            cells[index].textContent = data;
            gameFlow.setTurns(one, two);
        }  
    }

    for (let i=0; i<cells.length; i++) {
        cells[i].addEventListener('click', checkIndex);
    }

    function checkIndex (e) {
       let index = cells.indexOf(e.path[0]);
       clickOnCell(index, gameFlow.getData());
    } 

    function clearBoard() {
        for (let i=0; i<cells.length; i++)
        cells[i].textContent = '';
    }
    
    return {
        clearBoard
    }
})();

let gameFlow = (function (){

    let count = 0;
    let data
    function increaseCount () {
        count++;
    }

    function setTurns (player1, player2) {
        increaseCount();
        if (count%2 == 0) getPlayerData(player1);
        else getPlayerData(player2);
    }

    function getPlayerData (player) {
        data = player.getData();
    }

    function getData () {
        return data;
    }

    setTurns(one, two);

    return {
        setTurns, getData
    }
})();

