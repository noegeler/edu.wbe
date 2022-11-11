const boardWidth = 7
const boardHight = 6

let state = {board: undefined}
loadEmptyBoardState()

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
    let container = document.querySelector('.board')
    container.innerHTML = ""

    createBoard(container)
}

function createBoard(container) {
    let attr = {'class': 'field'}


    for (let i = 0; i < boardHight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            let piece = createPiece(state.board[i][j])
            let field = elt('div', attr, piece)
            container.appendChild(field)
        }
    }
}

function loadEmptyBoardState() {
    state.board = Array(boardHight).fill('').map(el => Array(boardWidth).fill(''))
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

function generatePiece() {
    let choices = [
        '',
        'r',
        'b'
    ]

    return choices[Math.floor(Math.random()*choices.length)];
}

function setNewRandomPiece() {
    let piece = generatePiece()
    let posHight = Math.floor(Math.random() * boardHight)
    let posWidth = Math.floor(Math.random() * boardWidth)

    state.board[posHight][posWidth] = piece
}

setInterval(function () {
    setNewRandomPiece()
    showBoard()
}, 1000)