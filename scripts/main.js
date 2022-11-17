const boardWidth = 7
const boardHight = 6

let state = {board: undefined, playerTurn: 'r'}
let container;
let newGameButton;

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        container = document.querySelector('.board')
        container.addEventListener('click', makeTurn)

        newGameButton = document.getElementById('newGame')
        newGameButton.addEventListener('click', newGame)

        // start new game
        newGame()
    }
}

function newGame() {
    loadEmptyBoardState()
    showBoard()
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
            changePlayerTurn()
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
    console.log(event.target)
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
}
