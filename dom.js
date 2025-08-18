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
        getActivePlayer,
        getBoard: board.getBoard,
    }
}

// const game = GameController();

function GameScreenController() {
    const game = GameController();
    
    const boardDiv = document.createElement("div")
    boardDiv.classList.add("board");
    
    const playerTurnDiv = document.createElement("h1");
    playerTurnDiv.classList.add("turn");

    
    const gameContainer = document.querySelector('.game-container');
    
    gameContainer.appendChild(playerTurnDiv);
    gameContainer.appendChild(boardDiv);


    // const boardDivSelector = document.querySelector('.board');

    const updateScreen = () => {
        // clear the board
        boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        // Render board squares
        let counter = 0;
        board.forEach(row => {
        row.forEach((cell, index) => {
            // Anything clickable should be a button!!
            counter++;
            const cellButton = document.createElement("button");
            cellButton.classList.add("cell");
            // Create a data attribute to identify the column
            // This makes it easier to pass into our `playRound` function 
            if (counter < 4) {
                cellButton.dataset.row = 1;
            } else if (counter < 7) {
                cellButton.dataset.row = 2;
            } else {cellButton.dataset.row = 3;}
            cellButton.dataset.column = index + 1;
            cellButton.textContent = cell.getValue();
            boardDiv.appendChild(cellButton);
        })
        })

    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn) return;
        if (!selectedRow) return;
        
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
    return {
        updateScreen,
    }
}

function LaunchScreenController() {
    // const gameStart = GameScreenController();
       
    const menuContainer = document.querySelector(".menu-container");
    
    const gameTitle = document.createElement("h1")
    const playerNameForm = document.createElement("form")
    const launchButton = document.createElement("button")

    menuContainer.appendChild(gameTitle);
    menuContainer.appendChild(playerNameForm);
    menuContainer.appendChild(launchButton);

    const playerOneNameLabel = document.createElement("label")
    const playerOneNameInput = document.createElement("input")
    const playerTwoNameLabel = document.createElement("label")
    const playerTwoNameInput = document.createElement("input")

    playerNameForm.appendChild(playerOneNameLabel);
    playerNameForm.appendChild(playerOneNameInput);
    playerNameForm.appendChild(playerTwoNameLabel);
    playerNameForm.appendChild(playerTwoNameInput);

    const showMenu = () => {
        // Add game title text
        gameTitle.textContent = "Tic Tac Toe"

        playerOneNameLabel.textContent = "Player One Name"
        playerTwoNameLabel.textContent = "Player Two Name"
        launchButton.textContent = "Start Game"
    }

    // Add event listener for the board
    // function clickHandlerBoard(e) {
    //     const selectedColumn = e.target.dataset.column;
    //     const selectedRow = e.target.dataset.row;
    //     // Make sure I've clicked a column and not the gaps in between
    //     if (!selectedColumn) return;
    //     if (!selectedRow) return;
        
    //     game.playRound(selectedRow, selectedColumn);
    //     updateScreen();
    // }
    // boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    showMenu();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}

LaunchScreenController();






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

// game.playRound(1,1) // X Turn 1
// game.playRound(1,2) // O Turn 1
// game.playRound(3,1) // X Turn 2
// game.playRound(2,2) // O Turn 2
// game.playRound(2,1) // X Turn 3

// Debugging -- Y Win Scenario

// game.playRound(1,1) // X Turn 1
// game.playRound(1,2) // O Turn 1
// game.playRound(3,1) // X Turn 2
// game.playRound(2,2) // O Turn 2
// game.playRound(2,3) // X Turn 3
// game.playRound(3,2) // O Turn 2