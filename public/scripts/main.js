const boardWidth = 7
const boardHight = 6
const SERVICE = "http://localhost:3000/api/data/c4state?api-key=c4game"

// events
const savingEvent = new Event('saved')
const loadingEvent = new Event('loading')
const failedEvent = new Event('failed')

// current state of board
let state = {board: undefined, playerTurn: 'r'}

// document elements
let container;
let newGameButton;
let loadButton;
let saveButton;
let savingProgress;

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        container = document.querySelector('.board')
        container.addEventListener('click', makeTurn)

        newGameButton = document.getElementById('newGame')
        newGameButton.addEventListener('click', newGame)

        loadButton = document.getElementById('load')
        loadButton.addEventListener('click', loadState)

        saveButton = document.getElementById('save')
        saveButton.addEventListener('click', saveState)


        // add events for savingProgress
        savingProgress = document.getElementById('savingState')
        savingProgress.addEventListener('loading', (e) => {
            savingProgress.innerHTML = '<img class="loading" src="./styles/icons/spinner-solid.svg" width="30" height="30"> </img>'
        })
        savingProgress.addEventListener('saved', (e) => {
            savingProgress.innerHTML = '✔'
            savingProgress.classList.toggle('failed', false)
            savingProgress.classList.toggle('saved', true)
        })
        savingProgress.addEventListener('failed', (e) => {
            savingProgress.innerHTML = '✖'
            savingProgress.classList.toggle('failed', true)
            savingProgress.classList.toggle('saved', false)
        })


        // start new game
        newGame()
    }
}

function newGame() {
    loadEmptyBoardState()
    showBoard()
    container.addEventListener('click', makeTurn)
}

function elt(type, attrs, ...children) {
    let node = document.createElement(type)
    for (a in attrs) {
        node.setAttribute(a, attrs[a])
    }
    for (let child of children) {
        if (typeof child != "string") {
            node.appendChild(child)
        } else {
            node.appendChild(document.createTextNode(child))
        }
    }
    return node
}

function showBoard() {
    container.innerHTML = ""

    createBoard(container)
}

function createBoard(container) {
    let attr = {'class': 'field', 'id': 0}
    for (let i = 0; i < boardHight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            let piece = createPiece(state.board[i][j])
            let field = elt('div', attr, piece)
            container.appendChild(field)

            attr['id']++
        }
    }
}

function loadEmptyBoardState() {
    state.board = Array(boardHight).fill('').map(el => Array(boardWidth).fill(''))
    state.playerTurn = 'r'
}

function addPieceToRow(columnNr) {
    // if row full return
    if (state.board[0][columnNr] !== '') {
        return
    }

    //check where board has piece
    for (let i = boardHight-1; i >= 0; i--) {
        if (state.board[i][columnNr] === '') {
            state.board[i][columnNr] = state.playerTurn
            return
        }
    }
}

function changePlayerTurn() {
    // else if -> mb in future change number of players
    if (state.playerTurn === 'r') {
        state.playerTurn = 'b'
    } else if (state.playerTurn === 'b') {
        state.playerTurn = 'r'
    }
}

function createPiece(state) {
    let piece = ''

    if (state !== '') {
        piece = elt('div', {'class': 'piece'}, '')
        if (state === 'b') {
            piece.classList.add('playerTwo')
        } else if (state === 'r') {
            piece.classList.add('playerOne')
        }
    }

    return piece
}

function makeTurn(event) {
    let field = event.target
    // if on piece is clicked get field
    if (field.classList.contains('piece')) {
        field = event.target.parentNode
    }

    // get number of column
    let id = parseInt(field.id)
    let columnNr = id % boardWidth

    addPieceToRow(columnNr)
    showBoard()

    // check winner
    checkWinner()
    changePlayerTurn()
}

//  Get current state from server and re-draw board
//
function loadState () {

    fetch(SERVICE, {
        method: 'GET',
    }).then(response => {
        response.json().then(data => {
            if (typeof data !== 'undefined') {
                state = data
                showBoard()
                checkWinner()
                changePlayerTurn()
                checkWinner()
                changePlayerTurn()
            }
        })
    })
}

//  Put current state to server
//
function saveState () {
    let data = JSON.stringify(state)
    savingProgress.dispatchEvent(loadingEvent)

    fetch(SERVICE, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: data
    }).then((response) => {
        savingProgress.dispatchEvent(savingEvent)
    }).catch((error) => {
        alert("Something went wrong while saving! Please try again.")
        savingProgress.dispatchEvent(failedEvent)
    })
}

function checkWinner() {
    if (connect4Winner(state.playerTurn, state.board)) {
        let player = (state.playerTurn === 'r') ? "One" : "Two"
        alert("Player " + player + " wins!!!")
        container.removeEventListener('click', makeTurn)
    }
}
