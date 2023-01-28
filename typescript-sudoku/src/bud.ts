class Solution {
    public isSafe(board:number[][],row:number,col:number,val:number):boolean {
        //column
        for(let i=0; i<board.length; i++) {
            if(board[i][col] == val) {
                return false;
            }
        }
       
        //row
        for(let j=0; j<board.length; j++) {
            if(board[row][j] == val) {
                return false;
            }
        }
       
        //grid
        let sr = 3 * (row/3);
        let sc = 3 * (col/3);
       
        for(let i=sr; i<sr+3; i++) {
            for(let j=sc; j<sc+3; j++) {
                console.log(i,j,board);
                if(board[i][j] == val) {
                    return false;
                }
            }
        }
       
        return true;
    }
   
    public helper(board:number[][],row:number,col:number) {
        if(row == board.length) {
            return true;
        }
       
        let nrow = 0;
        let ncol = 0;
       
        if(col == board.length-1) {
            nrow = row + 1;
            ncol = 0;
        } else {
            nrow = row;
            ncol = col + 1;
        }
       
        if(board[row][col] != 0) {
            if(this.helper(board, nrow, ncol)) {
                return true;
            }
        } else {
            //fill the place
            for(let i=1; i<=9; i++) {
                if(this.isSafe(board, row, col, i)) {
                    board[row][col] = i;
                    if(this.helper(board, nrow, ncol)){
                        return true;
                    }
                    else{
                        board[row][col] = 0;
                    }
                }
            }
        }
                      
        return false;
    }
   
    public solveSudoku(board:number[][]):void {
        this.helper(board, 0, 0);
    }
 }
 

 let bus = new Solution();
 
 let ar = [  [0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0,0]
            ];
 
 bus.solveSudoku(ar);
 
 console.log(ar);