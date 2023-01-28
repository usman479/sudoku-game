"use strict";
let sud = new Solution();
const newGrid = (size) => {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr[i] = [];
    }
    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i / size)][i % size] = CONSTANT.UNASSIGNED;
    }
    return arr;
};
// find unassigned cell
const findUnassignedPos = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
};
// shuffle arr
// const shuffleArray = (arr:number[]) => {
//     let curr_index = arr.length;
//     while (curr_index !== 0) {
//         let rand_index = Math.floor(Math.random() * curr_index);
//         curr_index--;
//         let temp = arr[curr_index];
//         arr[curr_index] = arr[rand_index];
//         arr[rand_index] = temp;
//     }
//     return arr;
// }
// check puzzle is complete
const isFullGrid = (grid) => {
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return value !== CONSTANT.UNASSIGNED;
        });
    });
};
// const sudokuCreate = (grid:number[][]) => {
//     let unassigned_pos = {
//         row: -1,
//         col: -1
//     }
//     if (!findUnassignedPos(grid, unassigned_pos)) return true;
//     let number_list = shuffleArray([...CONSTANT.NUMBERS]);
//     let row = unassigned_pos.row;
//     let col = unassigned_pos.col;
//     number_list.forEach((num, i) => {
//         if (isSafe(grid, row, col, num)) {
//             grid[row][col] = num;
//             if (isFullGrid(grid)) {
//                 return true;
//             } else {
//                 if (sudokuCreate(grid)) {
//                     return true;
//                 }
//             }
//             grid[row][col] = CONSTANT.UNASSIGNED;
//         }
//     });
//     return isFullGrid(grid);
// }
const sudokuCheck = (grid) => {
    if (grid == undefined) {
        return null;
    }
    let unassigned_pos = {
        row: -1,
        col: -1
    };
    if (!findUnassignedPos(grid, unassigned_pos))
        return true;
    // grid.forEach((row, i) => {
    //     row.forEach((num, j) => {
    //         if (isSafe(grid, i, j, num)) {
    //             if (isFullGrid(grid)) {
    //                 return true;
    //             } else {
    //                 if (sudokuCreate(grid)) {
    //                     return true;
    //                 }
    //             }
    //         }
    //     })
    // })
    // return isFullGrid(grid);
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return sud.isSafe(grid, i, j, value);
        });
    });
};
// const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);
// const removeCells = (grid:number[][], level:number) => {
//     let res = [...grid];
//     let attemps = level;
//     while (attemps > 0) {
//         let row = rand();
//         let col = rand();
//         while (res[row][col] === 0) {
//             row = rand();
//             col = rand();
//         }
//         res[row][col] = CONSTANT.UNASSIGNED;
//         attemps--;
//     }
//     return res;
// }
// generate sudoku base on level
const sudokuGen = (level) => {
    let grid = newGrid(CONSTANT.GRID_SIZE);
    let check = sud.solveSudoku(grid);
    if (check) {
        let question = sud.removeCells(grid, level);
        return {
            original: grid,
            question: question
        };
    }
    return undefined;
};
