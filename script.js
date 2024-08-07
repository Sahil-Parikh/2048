document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    let cells = document.querySelectorAll('.grid-cell');
    let tileValues = Array(16).fill(null);
    let score = 0;
    let highScore = localStorage.getItem('highscore') || 0;
    
    document.getElementById('highscore').textContent = highScore;

    // Initialize the grid with two random tiles
    addRandomTile();
    addRandomTile();

    // Add event listener for key presses
    document.addEventListener('keydown', handleKeyPress);

    function handleKeyPress(event) {
        if (event.key === 'ArrowUp') move('up');
        if (event.key === 'ArrowDown') move('down');
        if (event.key === 'ArrowLeft') move('left');
        if (event.key === 'ArrowRight') move('right');
    }

    function move(direction) {
        let hasMoved = false;
        let merged = Array(16).fill(false);

        for (let i = 0; i < 4; i++) {
            let line = getLine(i, direction);
            line = slideAndMerge(line, merged);
            setLine(i, direction, line);
            hasMoved = hasMoved || checkIfMoved(line);
        }

        if (hasMoved) {
            addRandomTile();
            updateGrid();
            checkGameOver();
        }
    }

    function slideAndMerge(line, merged) {
        line = line.filter(val => val !== null);

        for (let j = 0; j < line.length - 1; j++) {
            if (line[j] === line[j + 1] && !merged[j]) {
                line[j] *= 2;
                line[j + 1] = null;
                merged[j] = true;
                updateScore(line[j]);
            }
        }

        line = line.filter(val => val !== null);
        while (line.length < 4) line.push(null);

        return line;
    }

    function checkIfMoved(line) {
        return line.some((value, index) => tileValues[index] !== value);
    }

    function getLine(index, direction) {
        switch (direction) {
            case 'up':
                return [tileValues[index], tileValues[index + 4], tileValues[index + 8], tileValues[index + 12]];
            case 'down':
                return [tileValues[index + 12], tileValues[index + 8], tileValues[index + 4], tileValues[index]];
            case 'left':
                return tileValues.slice(index * 4, index * 4 + 4);
            case 'right':
                return tileValues.slice(index * 4, index * 4 + 4).reverse();
            default:
                return [];
        }
    }

    function setLine(index, direction, line) {
        switch (direction) {
            case 'up':
                tileValues[index] = line[0];
                tileValues[index + 4] = line[1];
                tileValues[index + 8] = line[2];
                tileValues[index + 12] = line[3];
                break;
            case 'down':
                tileValues[index + 12] = line[0];
                tileValues[index + 8] = line[1];
                tileValues[index + 4] = line[2];
                tileValues[index] = line[3];
                break;
            case 'left':
                tileValues[index * 4] = line[0];
                tileValues[index * 4 + 1] = line[1];
                tileValues[index * 4 + 2] = line[2];
                tileValues[index * 4 + 3] = line[3];
                break;
            case 'right':
                tileValues[index * 4] = line[3];
                tileValues[index * 4 + 1] = line[2];
                tileValues[index * 4 + 2] = line[1];
                tileValues[index * 4 + 3] = line[0];
                break;
        }
    }

    function updateGrid() {
        cells.forEach((cell, index) => {
            const value = tileValues[index];
            if (value) {
                cell.innerHTML = `<img src="images/${value}.png" alt="${value}">`;
                cell.classList.add('slide');
            } else {
                cell.innerHTML = '';
                cell.classList.remove('slide');
            }
        });
    }

    function addRandomTile() {
        const emptyCells = tileValues.map((value, index) => value === null ? index : null).filter(index => index !== null);
        if (emptyCells.length === 0) return;
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        tileValues[randomIndex] = Math.random() > 0.5 ? 2 : 4; // Start with 2 or 4
        updateGrid();
    }

    function updateScore(value) {
        score += value;
        document.getElementById('score').textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highscore', highScore);
            document.getElementById('highscore').textContent = highScore;
        }
    }

    function checkGameOver() {
        if (tileValues.includes(null)) return;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                if (tileValues[i * 4 + j] === tileValues[i * 4 + j + 1] || 
                    tileValues[j * 4 + i] === tileValues[(j + 1) * 4 + i]) {
                    return;
                }
            }
        }

        document.querySelector('.game-message').textContent = 'Game Over!';
        document.querySelector('.game-message').style.display = 'block';
        document.removeEventListener('keydown', handleKeyPress);
    }
});
