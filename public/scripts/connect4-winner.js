function connect4Winner(player, board) {
    let startingIndex = 0

    if (typeof board === 'undefined') {
        return false
    }

    for (let i = 0; i < board.length; i++) {
        startingIndex = 0
        for (let j = 0; j < board[i].filter(x => x === player).length; j++) {
            let index = board[i].indexOf(player, startingIndex)

            // check vertical
            if (i + 3 < board.length) {
                for (let counter = 1; counter < 4; counter++) {
                    if (board[i+counter][index] !== player) {
                        break
                    }

                    if (counter === 3) {
                        return true
                    }
                }
            }


            // check horizontal
            if (index + 3 < board[i].length) {
                for (let counter = 1; counter < 4; counter++) {
                    if (board[i][index+counter] !== player) {
                        break
                    }

                    if (counter === 3) {
                        return true
                    }
                }
            }

            // check diagonal right
            if (index + 3 < board[i].length && i + 3 < board.length) {
                for (let counter = 1; counter < 4; counter++) {
                    if (board[i+counter][index+counter] !== player) {
                        break
                    }

                    if (counter === 3) {
                        return true
                    }
                }
            }

            // check diagonal left
            if (index - 3 >= 0 && i + 3 < board.length) {
                for (let counter = 1; counter < 4; counter++) {
                    if (board[i+counter][index-counter] !== player) {
                        break
                    }

                    if (counter === 3) {
                        return true
                    }
                }
            }

            // search next position
            startingIndex = index+1
        }
    }

    return false
}