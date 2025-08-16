let numbers = [
    [1, 2], 
    [3, 4], 
    [5, 6, 7],
];

// let resultsEven = numbers.filter( (num) => { return num % 2 === 0 });
// let resultsOdd = numbers.filter( (num) => {return num % 2 === 1 });

// console.log(resultsEven);
// console.log(resultsOdd);

let resultsMap = numbers.map ( 
    (num) => {
        return num.map(  
            (num) => {return num*2} 
        )     
    });

console.log(resultsMap);

// the game //




function Gameboard() {
    // Initialize the board and the dimensions of the board.
    // In our case, 3x3 will suffice for tic tac toe.
    rows = 3;
    columns = 3;
    board = [];

    // Now, use a nested loop structure to create our board.

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const getRows = () => console.log(rows);

    const printBoard = () => {
        const printedBoard = board.map((row) => {
            return row.map((column) => {
                return column.getValue()
            })
        });
        console.log(printedBoard);
    }

    return {
        getBoard,
        getRows,
        printBoard,
    }

}

function Cell() {
    // Give each cell it's starting value
    let value = "";

    // Add function to update value with an X or O
    const setValue = (playerValue) => {
        value = playerValue; 
    }

    // Add function to retrive the value from this cell
    const getValue = () => value;
    
    return {
        setValue,
        getValue,
    }
}

function GameController(
    // Initialize our players with default names
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {



}


// Put the game into a factory function for code cleanliness

const testGame = Gameboard();

const game = GameController();