const boardWidth = 6
const boardHight = 7


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
    let container = Array.from(document.getElementsByClassName('board'))[0]
    container.innerHTML = ""

    createBoard(container)
}

function createBoard(container) {
    let attr = {'class': 'field'}


    for (let i = 0; i < boardHight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            let piece = generatePiece()
            let field = elt('div', attr, piece)
            container.appendChild(field)
        }
    }
}

function generatePiece() {
    let playerOne = elt('div', {'class': 'piece'}, '')
    let playerTwo = playerOne.cloneNode()
    playerOne.classList.add('playerOne')
    playerTwo.classList.add('playerTwo')
    let choices = [
        '',
        playerOne,
        playerTwo
    ]

    return choices[Math.floor(Math.random()*choices.length)];
}