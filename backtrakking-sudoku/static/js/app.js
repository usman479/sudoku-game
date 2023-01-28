"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
(_a = document.querySelector('#dark-mode-toggle')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    var _a;
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkmode', isDarkMode.toString());
    // chang mobile status bar color
    (_a = document.querySelector('meta[name="theme-color"')) === null || _a === void 0 ? void 0 : _a.setAttribute('content', isDarkMode ? '#1a1a2e' : '#fff');
});
// initial value
// screens
const start_screen = document.querySelector('#start-screen');
const game_screen = document.querySelector('#game-screen');
const pause_screen = document.querySelector('#pause-screen');
const result_screen = document.querySelector('#result-screen');
// ----------
const cells = document.querySelectorAll('.main-grid-cell');
const name_input = document.querySelector('#input-name');
const number_inputs = document.querySelectorAll('.number');
const player_name = document.querySelector('#player-name');
const game_level = document.querySelector('#game-level');
const game_time = document.querySelector('#game-time');
const result_time = document.querySelector('#result-time');
let level_index = 0;
let level = CONSTANT.LEVEL[level_index];
let timer = null;
let pause = false;
let seconds = 0;
let su = undefined;
let su_answer = undefined;
let selected_cell = -1;
// --------
const gameInfo = localStorage.getItem('game');
const getGameInfo = () => gameInfo ? JSON.parse(gameInfo) : undefined;
// add space for each 9 cells
const initGameGrid = () => {
    let index = 0;
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if (row === 2 || row === 5)
            cells[index].style.marginBottom = '10px';
        if (col === 2 || col === 5)
            cells[index].style.marginRight = '10px';
        index++;
    }
};
// ----------------
const setPlayerName = (name) => localStorage.setItem('player_name', name);
const getPlayerName = () => localStorage.getItem('player_name');
const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);
const clearSudoku = () => {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
};
const initSudoku = () => {
    // clear old sudoku
    clearSudoku();
    // remover hovered background
    resetBg();
    // generate sudoku puzzle here
    su = sudokuGen(level);
    su_answer = (su === null || su === void 0 ? void 0 : su.question) && [...su.question];
    seconds = 0;
    saveGameInfo();
    // show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if (su != undefined) {
            cells[i].setAttribute('data-value', su.question[row][col].toString());
            if (su.question[row][col] !== 0) {
                cells[i].classList.add('filled');
                cells[i].innerHTML = su.question[row][col].toString();
            }
        }
    }
};
const loadSudoku = () => {
    let game = getGameInfo();
    game_level != null ? game_level.innerHTML = CONSTANT.LEVEL_NAME[game.level] : null;
    su = game.su;
    su_answer = su === null || su === void 0 ? void 0 : su.answer;
    seconds = game.seconds;
    game_time != null ? game_time.innerHTML = showTime(seconds) : null;
    level_index = game.level;
    // show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if (su_answer != undefined && (su === null || su === void 0 ? void 0 : su.question)) {
            cells[i].setAttribute('data-value', su_answer[row][col].toString());
            cells[i].innerHTML = su_answer[row][col] !== 0 ? su_answer[row][col].toString() : '';
            if (su.question[row][col] !== 0) {
                cells[i].classList.add('filled');
            }
        }
    }
};
const hoverBg = (index) => {
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;
    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            cell.classList.add('hover');
        }
    }
    let step = 9;
    while (index - step >= 0) {
        cells[index - step].classList.add('hover');
        step += 9;
    }
    step = 9;
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        step += 9;
    }
    step = 1;
    while (index - step >= 9 * row) {
        cells[index - step].classList.add('hover');
        step += 1;
    }
    step = 1;
    while (index + step < 9 * row + 9) {
        cells[index + step].classList.add('hover');
        step += 1;
    }
};
const resetBg = () => {
    cells.forEach(e => e.classList.remove('hover'));
};
const checkErr = (value) => {
    const addErr = (cell) => {
        const cellData = cell.getAttribute('data-value');
        if (cellData && parseInt(cellData) === value) {
            cell.classList.add('err');
            cell.classList.add('cell-err');
            setTimeout(() => {
                cell.classList.remove('cell-err');
            }, 500);
        }
    };
    let index = selected_cell;
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;
    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;
    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            if (!cell.classList.contains('selected'))
                addErr(cell);
        }
    }
    let step = 9;
    while (index - step >= 0) {
        addErr(cells[index - step]);
        step += 9;
    }
    step = 9;
    while (index + step < 81) {
        addErr(cells[index + step]);
        step += 9;
    }
    step = 1;
    while (index - step >= 9 * row) {
        addErr(cells[index - step]);
        step += 1;
    }
    step = 1;
    while (index + step < 9 * row + 9) {
        addErr(cells[index + step]);
        step += 1;
    }
};
const removeErr = () => cells.forEach(e => e.classList.remove('err'));
const saveGameInfo = () => {
    let game = {
        level: level_index,
        seconds: seconds,
        su: {
            original: su === null || su === void 0 ? void 0 : su.original,
            question: su === null || su === void 0 ? void 0 : su.question,
            answer: su_answer
        }
    };
    localStorage.setItem('game', JSON.stringify(game));
};
const removeGameInfo = () => {
    localStorage.removeItem('game');
    const contButton = document.querySelector('#btn-continue');
    contButton ? contButton.style.display = 'none' : null;
};
const isGameWin = () => sudokuCheck(su_answer);
const showResult = () => {
    clearInterval(timer);
    if (result_screen && result_time) {
        result_screen.classList.add('active');
        result_time.innerHTML = showTime(seconds);
    }
};
const initNumberInputEvent = () => {
    number_inputs.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!cells[selected_cell].classList.contains('filled')) {
                cells[selected_cell].innerHTML = (index + 1).toString();
                cells[selected_cell].setAttribute('data-value', (index + 1).toString());
                // add to answer
                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE;
                su_answer ? su_answer[row][col] = index + 1 : null;
                // save game
                saveGameInfo();
                // -----
                removeErr();
                checkErr(index + 1);
                cells[selected_cell].classList.add('zoom-in');
                setTimeout(() => {
                    cells[selected_cell].classList.remove('zoom-in');
                }, 500);
                // check game win
                if (isGameWin()) {
                    removeGameInfo();
                    showResult();
                }
                // ----
            }
        });
    });
};
const initCellsEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!e.classList.contains('filled')) {
                cells.forEach(e => e.classList.remove('selected'));
                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                resetBg();
                hoverBg(index);
            }
        });
    });
};
const startGame = () => {
    start_screen && start_screen.classList.remove('active');
    game_screen && game_screen.classList.add('active');
    if (player_name && name_input) {
        player_name.innerHTML = name_input.value.trim();
        setPlayerName(name_input.value.trim());
    }
    game_level ? game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index] : null;
    showTime(seconds);
    timer = setInterval(() => {
        if (!pause) {
            seconds = seconds + 1;
            game_time ? game_time.innerHTML = showTime(seconds) : null;
        }
    }, 1000);
};
const returnStartScreen = () => {
    clearInterval(timer);
    pause = false;
    seconds = 0;
    if (start_screen && game_screen && pause_screen && result_screen) {
        start_screen.classList.add('active');
        game_screen.classList.remove('active');
        pause_screen.classList.remove('active');
        result_screen.classList.remove('active');
    }
};
// add button event
(_b = document.querySelector('#btn-level')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    const levelButton = e.target;
    levelButton.innerHTML = CONSTANT.LEVEL_NAME[level_index];
});
(_c = document.querySelector('#btn-play')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    if (!name_input) {
        return;
    }
    if (name_input.value.trim().length > 0) {
        initSudoku();
        startGame();
    }
    else {
        name_input.classList.add('input-err');
        setTimeout(() => {
            name_input.classList.remove('input-err');
            name_input.focus();
        }, 500);
    }
});
(_d = document.querySelector('#btn-continue')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
    if (name_input == null) {
        return null;
    }
    if (name_input.value.trim().length > 0) {
        loadSudoku();
        startGame();
    }
    else {
        name_input.classList.add('input-err');
        setTimeout(() => {
            name_input.classList.remove('input-err');
            name_input.focus();
        }, 500);
    }
});
(_e = document.querySelector('#btn-pause')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
    pause_screen === null || pause_screen === void 0 ? void 0 : pause_screen.classList.add('active');
    pause = true;
});
(_f = document.querySelector('#btn-resume')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => {
    pause_screen === null || pause_screen === void 0 ? void 0 : pause_screen.classList.remove('active');
    pause = false;
});
(_g = document.querySelector('#btn-new-game')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', () => {
    returnStartScreen();
});
(_h = document.querySelector('#btn-new-game-2')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', () => {
    console.log('object');
    returnStartScreen();
});
(_j = document.querySelector('#btn-delete')) === null || _j === void 0 ? void 0 : _j.addEventListener('click', () => {
    cells[selected_cell].innerHTML = '';
    cells[selected_cell].setAttribute('data-value', String(0));
    let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
    let col = selected_cell % CONSTANT.GRID_SIZE;
    su_answer ? su_answer[row][col] = 0 : null;
    removeErr();
});
// -------------
const init = () => {
    var _a;
    const getDark = localStorage.getItem('darkmode');
    const darkmode = getDark && JSON.parse(getDark);
    document.body.classList.add(darkmode ? 'dark' : 'light');
    (_a = document.querySelector('meta[name="theme-color"')) === null || _a === void 0 ? void 0 : _a.setAttribute('content', darkmode ? '#1a1a2e' : '#fff');
    const game = getGameInfo();
    const contButton = document.querySelector('#btn-continue');
    contButton ? contButton.style.display = game ? 'grid' : 'none' : null;
    // add space for each box of 3x3
    initGameGrid();
    initCellsEvent();
    initNumberInputEvent();
    const playerName = getPlayerName();
    if (playerName) {
        if (name_input)
            name_input.value = playerName;
    }
    else {
        name_input === null || name_input === void 0 ? void 0 : name_input.focus();
    }
};
init();
