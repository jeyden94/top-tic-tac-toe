function Gameboard() {
    rows = 3;
    columns = 3;
    board = [];
    let cellCounter = 1;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell(cellCounter));

            cellCounter++
        }
    }

    const getBoard = () => board;

    const checkForWin = (arr) => {

        let cellOne = arr[0];
        let cellTwo = arr[1];
        let cellThree = arr[2];

        let xPoints = 0;
        let oPoints = 0;

        for (let i = 0; i < rows; i++) {

            for (let j = 0; j < columns; j++) {

                if (cellOne === board[i][j].getCellId() && board[i][j].getValue() === "X" ) {
                    xPoints++;
                }
                if (cellTwo === board[i][j].getCellId() && board[i][j].getValue() === "X" ) {
                    xPoints++;
                }
                if (cellThree === board[i][j].getCellId() && board[i][j].getValue() === "X" ) {
                    xPoints++;
                }

                if (cellOne === board[i][j].getCellId() && board[i][j].getValue() === "O" ) {
                    oPoints++;
                }
                if (cellTwo === board[i][j].getCellId() && board[i][j].getValue() === "O" ) {
                    oPoints++;
                }
                if (cellThree === board[i][j].getCellId() && board[i][j].getValue() === "O" ) {
                    oPoints++;
                }
            }
        }  

        if (xPoints === 3) {
            return 2; // Return 2 for "X" Player Victory
        } else if (oPoints === 3) {
            return 1; // Return 1 for "O" Player Victory
        } else {return 0;}

    }

    const addMarker = (row, col, player) => {
        row--;
        col--;

        if (board[row][col].getValue() === "") {
            board[row][col].setValue(player);
        } else {
            throw Error("Can't place your mark here!");
        }
    }

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
        addMarker,
        printBoard,
        checkForWin,
    }
}

function Cell(cellId) {

    let value = "";

    const setValue = (player) => {
        value = player; 
    }

    const getValue = () => value;
    
    const getCellId = () => cellId;

    return {
        setValue,
        getValue,
        getCellId,
    }
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    let round = 0;

    const players = [
        {
            name: playerOneName,
            marker: "X",
        },
        {
            name: playerTwoName,
            marker: "O",
        }
    ]

    const board = Gameboard();

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, col) => {
               
        let marker = getActivePlayer().marker;
        board.addMarker(row, col, marker);
        round++;
        console.log(`${getActivePlayer().name} plays row ${row}, column ${col}.`);
        checkForEndGame();
    }

    printNewRound();

    const checkForEndGame = () => {
        let status = 0;

        let winningCombinations = [
            [1,2,3],
            [4,5,6],
            [7,8,9],
            [1,4,7],
            [2,5,8],
            [3,6,9],
            [1,5,9],
            [7,5,3]
        ]
    
        for (let i in winningCombinations) {
            let status = board.checkForWin(winningCombinations[i]);
      
            if (status === 2) {
                console.log(`${players[0].name} Wins!`)
                board.printBoard();
                return;
            }
        
            if (status === 1) {
                console.log(`${players[1].name} Wins!`)
                board.printBoard();
                return;
            }
        }

        if (status === 0 && round === 9) {
            console.log("It's a tie!")
            board.printBoard();
            return;
        }

        switchActivePlayer();
        printNewRound();
    
    }

    return {
        printNewRound,
        playRound,
        checkForEndGame,
    }
}

const game = GameController();


// Debugging -- Tie Scenario

// game.playRound(1,1) // X Turn 1
// game.playRound(1,2) // O Turn 1
// game.playRound(1,3) // X Turn 2
// game.playRound(2,2) // O Turn 2
// game.playRound(2,1) // X Turn 3
// game.playRound(2,3) // O Turn 3
// game.playRound(3,3) // X Turn 4
// game.playRound(3,1) // O Turn 4
// game.playRound(3,2) // X Turn 5

// Debugging -- X Win Scenario

game.playRound(1,1) // X Turn 1
game.playRound(1,2) // O Turn 1
game.playRound(3,1) // X Turn 2
game.playRound(2,2) // O Turn 2
game.playRound(2,1) // X Turn 3

// Debugging -- Y Win Scenario

// game.playRound(1,1) // X Turn 1
// game.playRound(1,2) // O Turn 1
// game.playRound(3,1) // X Turn 2
// game.playRound(2,2) // O Turn 2
// game.playRound(2,3) // X Turn 3
// game.playRound(3,2) // O Turn 2