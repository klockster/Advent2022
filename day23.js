var day23 = (() => {
    let parseInputToInitialGrid = (rawInput) => {
        return rawInput.split(/\n/).filter(el => el).map(row => row.split(''))
    };

    let getColumn = (grid, col) => grid.map(row => row[col]);

    let padGridIfNeeded = (grid) => {
        if (grid[0].indexOf('#') > -1) {
            grid.unshift(''.padStart(grid[0].length, '.').split(''));
        }
        if (last(grid).indexOf('#') > -1) {
            grid.push(''.padStart(grid[0].length, '.').split(''));
        }

        if (getColumn(grid, 0).indexOf('#') > -1) {
            grid.forEach(row => {
                row.unshift('.');
            });
        }

        if (getColumn(grid, grid[0].length - 1).indexOf('#') > -1) {
            grid.forEach(row => {
                row.push('.');
            });
        }

        return grid;
    };

    let getSurroundingPositions = (grid, position) => {
        let [row, col] = position;
        return [
            [row - 1, col - 1],
            [row - 1, col],
            [row - 1, col + 1],
            [row, col - 1],
            [row, col + 1],
            [row + 1, col - 1],
            [row + 1, col],
            [row + 1, col + 1],
        ];
    };

    const DIRECTION_NORTH = 'N';
    const DIRECTION_SOUTH = 'S';
    const DIRECTION_WEST = 'W';
    const DIRECTION_EAST = 'E';

    let getPositionsInDirection = (grid, position, direction) => {
        let [row, col] = position;
        switch (direction) {
            case DIRECTION_NORTH:
                return [[row - 1, col - 1], [row - 1, col], [row - 1, col + 1]];
            case DIRECTION_SOUTH:
                return [[row + 1, col - 1], [row + 1, col], [row + 1, col + 1]];
            case DIRECTION_WEST:
                return [[row - 1, col - 1], [row, col - 1], [row + 1, col - 1]];
            case DIRECTION_EAST:
                return [[row - 1, col + 1], [row, col + 1], [row + 1, col + 1]];
            default:
                assert(false, `direction ${direction} not in N,E,S,W`);
        }
    };

    let getMoveInDirection = (position, direction) => {
        let [row, col] = position;
        switch (direction) {
            case DIRECTION_NORTH:
                return [row - 1, col];
            case DIRECTION_SOUTH:
                return [row + 1, col];
            case DIRECTION_WEST:
                return [row, col - 1];
            case DIRECTION_EAST:
                return [row, col + 1];
            default:
                assert(false, `direction ${direction} not in N,E,S,W`);
        }
    };

    let smallestBoundingElfGrid = (grid) => {
        let result = JSON.parse(JSON.stringify(grid));
        while (result[0].indexOf('#') === -1 && result.length) {
            result.shift();
        }
        while (last(result).indexOf('#') === -1 && result.length) {
            result.pop();
        }
        while (getColumn(result, 0).indexOf('#') === -1 && result[0].length) {
            result.forEach(row => row.shift());
        }
        while (getColumn(result, result[0].length - 1).indexOf('#') === -1 && result[0].length) {
            result.forEach(row => row.pop());
        }

        return result;
    };

    let countEmptyTiles = (grid) => {
        return grid.map(row => row.reduce((a, e) => e === '.' ? a + 1 : a, 0))
            .reduce((a, e) => a + e, 0);
    };

    let part2 = (rawInput) => {
        let grid = padGridIfNeeded(parseInputToInitialGrid(rawInput));

        let directionRotation = [
            DIRECTION_NORTH,
            DIRECTION_SOUTH,
            DIRECTION_WEST,
            DIRECTION_EAST,
        ];

        let round = 1;
        while (true) {
            // map of the position of the proposed move to an array of elf positions proposing the move
            let proposedMovesForElves = {};

            grid.forEach((row, rowIndex) => {
                row.forEach((tile, colIndex) => {
                    let position = [rowIndex, colIndex];
                    if (tile === '.') {
                        return;
                    }

                    assert(tile === '#', 'sanity check');
                    let hasElfNearby = getSurroundingPositions(grid, position)
                        .findIndex(p => grid[p[0]][p[1]] === '#') > -1;

                    if (!hasElfNearby) {
                        return;
                    }

                    for (let directionIndex = 0; directionIndex < directionRotation.length; directionIndex++) {
                        let dir = directionRotation[directionIndex];

                        let hasElfInDirection = getPositionsInDirection(grid, position, dir)
                            .findIndex(p => grid[p[0]][p[1]] === '#') > -1;

                        if (!hasElfInDirection) {
                            let proposedKey = getMoveInDirection(position, dir).join(',');
                            proposedMovesForElves[proposedKey] = proposedMovesForElves[proposedKey] ?
                                proposedMovesForElves[proposedKey].concat([position]) :
                                [position];

                            break;
                        }
                    }
                });
            });

            Object.keys(proposedMovesForElves).forEach(posKey => {
                let elvesProposingToMove = proposedMovesForElves[posKey];
                if (elvesProposingToMove.length > 1) {
                    // nobody moves if more than one wants to
                    return;
                }

                let [oldRow, oldCol] = elvesProposingToMove[0];
                let [newRow, newCol] = posKey.split(',').map(n => parseInt(n, 10));
                grid[oldRow][oldCol] = '.';
                grid[newRow][newCol] = '#';
            });

            // at the end of each round, pad the grid out if needed
            grid = padGridIfNeeded(grid);
            // the first considered direction becomes the last:
            directionRotation.push(directionRotation.shift());

            if (Object.keys(proposedMovesForElves).length === 0) {
                break;
            }

            round++;
        }

        return round;
    };

    let part1 = (rawInput) => {
        let grid = padGridIfNeeded(parseInputToInitialGrid(rawInput));

        let directionRotation = [
            DIRECTION_NORTH,
            DIRECTION_SOUTH,
            DIRECTION_WEST,
            DIRECTION_EAST,
        ];

        for (let round = 1; round <= 10; round++) {
            // map of the position of the proposed move to an array of elf positions proposing the move
            let proposedMovesForElves = {};

            grid.forEach((row, rowIndex) => {
                row.forEach((tile, colIndex) => {
                    let position = [rowIndex, colIndex];
                    if (tile === '.') {
                        return;
                    }

                    assert(tile === '#', 'sanity check');
                    let hasElfNearby = getSurroundingPositions(grid, position)
                        .findIndex(p => grid[p[0]][p[1]] === '#') > -1;

                    if (!hasElfNearby) {
                        return;
                    }

                    for (let directionIndex = 0; directionIndex < directionRotation.length; directionIndex++) {
                        let dir = directionRotation[directionIndex];

                        let hasElfInDirection = getPositionsInDirection(grid, position, dir)
                            .findIndex(p => grid[p[0]][p[1]] === '#') > -1;

                        if (!hasElfInDirection) {
                            let proposedKey = getMoveInDirection(position, dir).join(',');
                            proposedMovesForElves[proposedKey] = proposedMovesForElves[proposedKey] ?
                                proposedMovesForElves[proposedKey].concat([position]) :
                                [position];

                            break;
                        }
                    }
                });
            });

            Object.keys(proposedMovesForElves).forEach(posKey => {
                let elvesProposingToMove = proposedMovesForElves[posKey];
                if (elvesProposingToMove.length > 1) {
                    // nobody moves if more than one wants to
                    return;
                }

                let [oldRow, oldCol] = elvesProposingToMove[0];
                let [newRow, newCol] = posKey.split(',').map(n => parseInt(n, 10));
                grid[oldRow][oldCol] = '.';
                grid[newRow][newCol] = '#';
            });

            // at the end of each round, pad the grid out if needed
            grid = padGridIfNeeded(grid);
            // the first considered direction becomes the last:
            directionRotation.push(directionRotation.shift());
        }

        return countEmptyTiles(smallestBoundingElfGrid(grid));
    };

    return [part1, part2];
})();
