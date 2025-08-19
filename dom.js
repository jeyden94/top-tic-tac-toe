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
        board.map((row) => {
            return row.map((column) => {
                return column.getValue()
            })
        });
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

function GameController(playerOneName, playerTwoName) {
    // Create a round counter to help track for ties
    let round = 0; // One round for each square 1-9
    
    // Probably a better way to do this, but using a status to track win conditions
    // If 0, no winner or tie; If 1, Player 2 has won; If 2, Player 3 has won.
    let status = 0;

    // Initialize our winner
    let winner = "";

    // Add players to an array to consolidate names and their markers
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

    // Call the Gameboard function and stick the return values into a "board" variable
    const board = Gameboard();

    // Initialize the active player and the first player in the array. Only runs when new game is launched
    let activePlayer = players[0];

    // Create an active player switch which runs everytime a marker is set down. Swaps active player to non-active
    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    // Create function I can run in the game screen controller that allows me to grab active player
    const getActivePlayer = () => activePlayer;

    // Create function I can run in the game screen controller that allows me to print the board
    const printNewRound = () => {
        board.printBoard();
    }

    const playRound = (row, col) => {
               
        let marker = getActivePlayer().marker;
        board.addMarker(row, col, marker);
        round++;
        status = checkForEndGame(status);

        if (status === 2) {
            board.printBoard();
            return `${players[0].name}`;
        } else if (status === 1) {
            board.printBoard();
            return `${players[1].name}`;
        } else if (status === 0 && round === 9) {
            board.printBoard();
            return "tie";
        } else {
            return "";
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
    }
}

// const game = GameController();

function GameScreenController(playerOneName, playerTwoName) {

    // Before initializing the game screen, call the GameController to launch the logic that behind the board
    // Store this in a new game variable to access functions associated the game logic
    const game = GameController(playerOneName, playerTwoName);

    // Create game container to replace menu container
    const gameContainer = document.querySelector('.game-container');

    // Create new child divs for the game container, add classes for styling
    const boardDiv = document.createElement("div")
    boardDiv.classList.add("board");
    const playerTurnDiv = document.createElement("h1");
    playerTurnDiv.classList.add("turn");
    const playAgainButton = document.createElement("button");
    playAgainButton.classList.add("play-again-btn");

    // Append new children, excluding the play again
    gameContainer.appendChild(playerTurnDiv);
    gameContainer.appendChild(boardDiv);

    const updateScreen = (winner) => {
        
        // Start by clearing the board
        boardDiv.textContent = "";
        
        // Get the latest array of the board and the current player so we know whose turn it is
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        // Render board squares
        let currentCell = 0; // Current cell tracker to assign row numbers and columns
        board.forEach(row => {
            row.forEach((cell, index) => {
                
                // Increment cell tracker by 1
                currentCell++;

                // Create a new cell button for each cell in the grid and give it a class
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                // Create data attributes to identify columns and rows
                // This makes it easier to pass into our `playRound` function 
                if (currentCell < 4) {
                    cellButton.dataset.row = 1;
                } else if (currentCell < 7) {
                    cellButton.dataset.row = 2;
                } else {cellButton.dataset.row = 3;}

                cellButton.dataset.column = index + 1;
                cellButton.textContent = cell.getValue();

                // Stick the button onto the board, will use css to turn it into 3x3 grid
                boardDiv.appendChild(cellButton);

            });
        });

        if (winner === `${game.players[0].name}` || winner === `${game.players[1].name}`) {
            playerTurnDiv.textContent = `${winner} wins!`
            endGameFlow();
        } else if (winner === "tie") {
            playerTurnDiv.textContent = "It's a tie!"
            endGameFlow();
        } else return
       
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
    // Create menu container and its children.
    const menuContainer = document.querySelector(".menu-container");
    const gameTitle = document.createElement("h1")
    const playerNameForm = document.createElement("form")
    const launchButton = document.createElement("button")

    // Add class to the launch button for styling
    launchButton.classList.add("start-btn")

    // Append children to the menu container
    menuContainer.appendChild(gameTitle);
    menuContainer.appendChild(playerNameForm);
    menuContainer.appendChild(launchButton);

    // Create player one form label and input and set attributes of type and value, respectively
    const playerOneNameLabel = document.createElement("label")
    const playerOneNameInput = document.createElement("input")
    playerOneNameInput.setAttribute("type","text")
    playerOneNameInput.setAttribute("placeholder","Player One")

    // Create player two form label and input and set attributes of type and value, respectively
    const playerTwoNameLabel = document.createElement("label")
    const playerTwoNameInput = document.createElement("input")
    playerTwoNameInput.setAttribute("type","text")
    playerTwoNameInput.setAttribute("placeholder","Player Two")

    // Function which shows the menu by adding text content and appending form children
    const showMenu = () => {
        gameTitle.textContent = "Tic Tac Toe"
        playerOneNameLabel.textContent = "Player One Name"
        playerTwoNameLabel.textContent = "Player Two Name"
        launchButton.textContent = "Start Game"
        
        // Append form labels and inputs for both players to the form
        playerNameForm.appendChild(playerOneNameLabel);
        playerNameForm.appendChild(playerOneNameInput);
        playerNameForm.appendChild(playerTwoNameLabel);
        playerNameForm.appendChild(playerTwoNameInput);
    }

    // Add event listener for the start button
    function clickHandlerStart() {
        // Hide the menu
        hideMenu();

        // Check is player names have a value, if so, use it, if not, use the placeholder text
        if (playerOneNameInput.value === "") {
            playerOne = playerOneNameInput.placeholder;
        } else (playerOne = playerOneNameInput.value)
     
        if (playerTwoNameInput.value === "") {
            playerTwo = playerTwoNameInput.placeholder;
        } else (playerOne = playerTwoNameInput.value)

        // Launch the GameScreenController, pass values for the player names
        GameScreenController(playerOne, playerTwo);
    }
    launchButton.addEventListener("click", clickHandlerStart);

    const hideMenu = () => {
        // Remove children from the menu container to hide it upon game launch
        menuContainer.removeChild(gameTitle);
        menuContainer.removeChild(playerNameForm);
        menuContainer.removeChild(launchButton);    
    }

    // Initial render
    showMenu();
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