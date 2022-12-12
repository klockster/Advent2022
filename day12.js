var day12 = (() => {
    let parseInputToGrid = (rawInput) => {
        return rawInput.split(/\n/).filter(el => el).map(el => el.split(''));
    };

    let getPositionKey = (rowIndex, colIndex) => {
        return `${rowIndex},${colIndex}`;
    };

    let getLetterIndex = (() => {
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let lettersToIndexes = {};

        letters.split('').forEach((letter, index) => {
            lettersToIndexes[letter] = index;
        });

        return (letter) => {
            if (letter === 'E') {
                return lettersToIndexes['z'];
            }
            let result = lettersToIndexes[letter];
            assert(result !== undefined, 'letter must exist, tried to get: ' + letter);
            return result;
        };
    })();

    let getViableNextPositions = (grid, rowIndex, colIndex) => {
        let current = grid[rowIndex][colIndex];

        return [
            [rowIndex - 1, colIndex],
            [rowIndex + 1, colIndex],
            [rowIndex, colIndex - 1],
            [rowIndex, colIndex + 1],
        ].filter(el => {
            let [row, col] = el;
            let letter = grid[row] && grid[row][col];

            return letter && (
                current === 'S' ||
                letter === 'S' ||
                getLetterIndex(current) >= getLetterIndex(letter) - 1
            );
        });
    };

    let bfs = (grid, start, goal) => {
        let goalKey = getPositionKey(...goal);
        let visited = {};

        let queue = [start];
        let nextForQueue = [];
        let round = 0;
        while (true) {
            while (queue.length) {
                let current = queue.shift();
                let currentKey = getPositionKey(...current);
                if (currentKey === goalKey) {
                    return round;
                }
                visited[currentKey] = true;

                let validNeighbors = getViableNextPositions(grid, ...current);
                validNeighbors.forEach(n => {
                    let key = getPositionKey(...n);
                    if (!visited[key]) {
                        visited[key] = true;
                        nextForQueue.push(n);
                    }
                });
            }

            round++;
            // if it takes more than the amount of spaces on the grid, or if we have nothing left to try, time to break
            let shouldBreak = round > (grid.length * grid[0].length) || nextForQueue.length == 0;
            if (shouldBreak) {
                break;
            }

            queue = nextForQueue;
            nextForQueue = [];
        }

        // if we get here, assume it wasn't possible, you fell in a hole: condolences
        return Number.MAX_SAFE_INTEGER;
    };

    let getTargetPosition = (grid, target = 'E') => {
        for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
            let row = grid[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                if (row[colIndex] === target) {
                    return [rowIndex, colIndex];
                }
            }
        }

        assert(false, 'need to find the goal position');
    };

    let getPositionsOfLetter = (grid, target = 'a') => {
        let result = [];
        for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
            let row = grid[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                if (row[colIndex] === target) {
                    result.push([rowIndex, colIndex]);
                }
            }
        }

        return result;
    };

    let part2 = (rawInput) => {
        let grid = parseInputToGrid(rawInput);
        let goalPosition = getTargetPosition(grid);
        let possibleHikeStarts = getPositionsOfLetter(grid).concat([getTargetPosition(grid, 'S')]);
        // this is not optimized, but it will complete in like ~3 seconds. Probably better to make some sort of map
        // to avoid so much duplicate work. But I'm not gonna
        return Math.min(...possibleHikeStarts.map(p => bfs(grid, p, goalPosition)));
    };

    let fewestStepsHillClimb = (rawInput) => {
        let grid = parseInputToGrid(rawInput);
        return bfs(grid,  getTargetPosition(grid, 'S'), getTargetPosition(grid));
    };

    return [fewestStepsHillClimb, part2];
})();
