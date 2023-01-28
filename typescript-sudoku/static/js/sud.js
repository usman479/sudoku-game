"use strict";
class Sol {
    isSafe(board, row, col, val) {
        //column
        for (let i = 0; i < board.length; i++) {
            if (board[i][col] == val) {
                return false;
            }
        }
        //row
        for (let j = 0; j < board.length; j++) {
            if (board[row][j] == val) {
                return false;
            }
        }
        //grid
        let sr = 3 * (row / 3);
        let sc = 3 * (col / 3);
        for (let i = sr; i < sr + 3; i++) {
            for (let j = sc; j < sc + 3; j++) {
                if (board[i][j] == val) {
                    return false;
                }
            }
        }
        return true;
    }
    helper(board, row, col) {
        if (row == board.length) {
            return true;
        }
        let nrow = 0;
        let ncol = 0;
        if (col == board.length - 1) {
            nrow = row + 1;
            ncol = 0;
        }
        else {
            nrow = row;
            ncol = col + 1;
        }
        if (board[row][col] != 0) {
            if (this.helper(board, nrow, ncol)) {
                return true;
            }
        }
        else {
            //    const shuffledArray = this.shuffleArray([...CONSTANT.NUMBERS]);
            for (let i = 1; i <= 9; i++) {
                if (this.isSafe(board, row, col, i)) {
                    board[row][col] = i;
                    if (this.helper(board, nrow, ncol))
                        return true;
                    else
                        board[row][col] = 0;
                }
            }
        }
        return false;
    }
    solveSudoku(board) {
        this.helper(board, 0, 0);
        return true;
    }
}
