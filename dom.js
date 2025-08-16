function Gameboard() {
    rows = 3;
    columns = 3;
    board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const addMarker = (col, row, player) => {
        row--;
        col--;

        if (board[row][col].getValue() === "") {
            board[row][col].setValue(player);
        } else {
            console.log("Can't play your mark here!");
            return;
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

    const checkWinCondition = () => {
        
    }

    return {
        getBoard,
        addMarker,
        printBoard,
    }
}

function Cell() {

    let value = "";

    const setValue = (player) => {
        value = player; 
    }

    const getValue = () => value;
    
    return {
        setValue,
        getValue,
    }
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {

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

    const playRound = (col, row) => {
        let marker = getActivePlayer().marker;
        board.addMarker(col, row, marker);
        console.log(`${getActivePlayer().name} plays row ${row}, column ${col}.`);
        switchActivePlayer();
        printNewRound();
    }

    return {
        printNewRound,
        playRound,
    }
}

const game = GameController();