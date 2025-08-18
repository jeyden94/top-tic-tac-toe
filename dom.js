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
    let round = 0; // One round for each square 1-9
    let status = 0; // If 0, no winner or tie; If 1, Player 2 has won; If 2, Player 3 has won.
    let winner = "hi";

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

    console.log(`${players[0].name}`)
    console.log(`${players[1].name}`)

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
        status = checkForEndGame(status);

        console.log(round)
        console.log(status)

        if (status === 2) {
            console.log(`${players[0].name} Wins!`)
            winner = `${players[0].name}`
            board.printBoard();
            return winner;
        } else if (status === 1) {
            console.log(`${players[1].name} Wins!`)
            winner = `${players[1].name}`
            board.printBoard();
            return winner;
        } else if (status === 0 && round === 9) {
            winner = "tie"
            console.log("It's a tie!")
            board.printBoard();
            return winner;
        } else {
            return winner;
        }
    }

    printNewRound();

    const checkForEndGame = (status) => {

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
                // console.log(`${players[0].name} Wins!`)
                board.printBoard();
                return status;
            }
        
            if (status === 1) {
                // console.log(`${players[1].name} Wins!`)
                board.printBoard();
                return status;
            }
        }

        if (status === 0 && round === 9) {
            // console.log("It's a tie!")
            board.printBoard();
            return status;
        }

        switchActivePlayer();
        printNewRound();
        return status;
    }

    return {
        winner,
        players,
        printNewRound,
        playRound,
        checkForEndGame,
        getActivePlayer,
        getBoard: board.getBoard,
        // GameController,
    }
}

// const game = GameController();

function GameScreenController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"  
) {
    const game = GameController(playerOneName, playerTwoName);

    const boardDiv = document.createElement("div")
    boardDiv.classList.add("board");
    
    const playerTurnDiv = document.createElement("h1");
    playerTurnDiv.classList.add("turn");
    
    const playAgainButton = document.createElement("button");
    playAgainButton.classList.add("play-again-btn");

    const gameContainer = document.querySelector('.game-container');
    
    gameContainer.appendChild(playerTurnDiv);
    gameContainer.appendChild(boardDiv);
    
    console.log(game.winner)

    if (game.winner === "tie") {
        console.log("hello")
    }
    // const boardDivSelector = document.querySelector('.board');

    const updateScreen = (winner) => {
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
            });
        });


        if (winner === "tie") {
            playerTurnDiv.textContent = "It's a tie!"
            endGameFlow();
        }

        if (winner === `${game.players[0].name}` || winner === `${game.players[1].name}`) {
            playerTurnDiv.textContent = `${winner} wins!`
            endGameFlow();
        }
       
    }

    function endGameFlow() {
        boardDiv.removeEventListener("click", clickHandlerBoard);
        gameContainer.appendChild(playAgainButton);
        playAgainButton.textContent = "Play Again?"
    }

    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn) return;
        if (!selectedRow) return;
        
        winner = game.playRound(selectedRow, selectedColumn);
        updateScreen(winner);
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    function clickHandlerAgain(e) {
        gameContainer.removeChild(playerTurnDiv);
        gameContainer.removeChild(boardDiv);
        gameContainer.removeChild(playAgainButton);
        GameScreenController(playerOneName,playerTwoName);
    }
    playAgainButton.addEventListener("click", clickHandlerAgain);

    // Initial render
    updateScreen();

    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
    return {
        updateScreen,
        // GameController,
    }
}

function LaunchScreenController() {
    


    const menuContainer = document.querySelector(".menu-container");
    
    const gameTitle = document.createElement("h1")
    const playerNameForm = document.createElement("form")
    const launchButton = document.createElement("button")
    launchButton.classList.add("start-btn")

    menuContainer.appendChild(gameTitle);
    menuContainer.appendChild(playerNameForm);
    menuContainer.appendChild(launchButton);

    const playerOneNameLabel = document.createElement("label")
    const playerOneNameInput = document.createElement("input")
    playerOneNameInput.setAttribute("type","text")
    playerOneNameInput.setAttribute("value","Player One")

    const playerTwoNameLabel = document.createElement("label")
    const playerTwoNameInput = document.createElement("input")
    playerTwoNameInput.setAttribute("type","text")
    playerTwoNameInput.setAttribute("value","Player Two")

    playerNameForm.appendChild(playerOneNameLabel);
    playerNameForm.appendChild(playerOneNameInput);
    playerNameForm.appendChild(playerTwoNameLabel);
    playerNameForm.appendChild(playerTwoNameInput);

    const showMenu = () => {
        gameTitle.textContent = "Tic Tac Toe"
        playerOneNameLabel.textContent = "Player One Name"
        playerTwoNameLabel.textContent = "Player Two Name"
        launchButton.textContent = "Start Game"
    }

    // Add event listener for the start button
    function clickHandlerStart(e) {
        hideMenu();
        const playerOneName = playerOneNameInput.value;
        const playerTwoName = playerTwoNameInput.value;

        GameScreenController(playerOneName,playerTwoName);
    }
    launchButton.addEventListener("click", clickHandlerStart);

    const hideMenu = () => {
        menuContainer.removeChild(gameTitle);
        menuContainer.removeChild(playerNameForm);
        menuContainer.removeChild(launchButton);    
    }

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