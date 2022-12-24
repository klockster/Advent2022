var day24 = (() => {
    let BLIZZARD_BIT_LEFT = 1;
    let BLIZZARD_BIT_RIGHT = 2;
    let BLIZZARD_BIT_UP = 4;
    let BLIZZARD_BIT_DOWN = 8;

    let parseInputToGrid = (rawInput) => {
        return rawInput.split(/\n/).filter(el => el).map(row => row.split(''));
    };

    let makeBlizzardMoves = (grid) => {
        let resultGrid = grid.map((row, i) => {
            if (i === 0 || i === grid.length - 1) {
                return JSON.parse(JSON.stringify(row));
            }

            let rowStr = '#'.padEnd(grid[0].length - 1, '.') + '#';
            return rowStr.split('');
        });

        let directionMap = {
            '>': [0, 1],
            '<': [0, -1],
            '^': [-1, 0],
            'v': [1, 0],
        };

        let numberToDirections = {
            [BLIZZARD_BIT_LEFT]: '<',
            [BLIZZARD_BIT_RIGHT]: '>',
            [BLIZZARD_BIT_UP]: '^',
            [BLIZZARD_BIT_DOWN]: 'v',
        };

        let directionsToNumber = objectFlip(numberToDirections);

        grid.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                let tilesToMove = [tile];
                if (!isNaN(parseInt(tile, 10))) {
                    tilesToMove = [];
                    let flags = parseInt(tile, 10);
                    Object.keys(numberToDirections).forEach(bit => {
                        if (flags & bit) {
                            tilesToMove.push(numberToDirections[bit]);
                        }
                    });
                }

                tilesToMove.forEach(tile => {
                    let move = directionMap[tile];
                    if (move === undefined) {
                        return;
                    }

                    let nextTilePos = [rowIndex + move[0], colIndex + move[1]];
                    let nextTile = resultGrid[nextTilePos[0]][nextTilePos[1]];

                    if (nextTile === '#') {
                        // nextTilePos / nextTile should be rewritten
                        switch (tile) {
                            case '>':
                                nextTilePos = [nextTilePos[0], 1];
                                break;
                            case '^':
                                nextTilePos = [grid.length - 2, nextTilePos[1]];
                                break;
                            case '<':
                                nextTilePos = [nextTilePos[0], grid[0].length - 2];
                                break;
                            case 'v':
                                nextTilePos = [1, nextTilePos[1]];
                                break;
                            default:
                                assert(false, `unhandled direction arrow ${tile}`);
                        }

                        nextTile = resultGrid[nextTilePos[0]][nextTilePos[1]];
                    }

                    if (nextTile === '.') {
                        resultGrid[nextTilePos[0]][nextTilePos[1]] = tile;
                        return;
                    }

                    if (directionMap[nextTile] !== undefined) {
                        // there's already a blizzard there, we need to write a number down now
                        resultGrid[nextTilePos[0]][nextTilePos[1]] = directionsToNumber[nextTile] | directionsToNumber[tile];
                        return;
                    }

                    if (!isNaN(parseInt(nextTile, 10))) {
                        resultGrid[nextTilePos[0]][nextTilePos[1]] = parseInt(nextTile, 10) | directionsToNumber[tile];
                        return;
                    }

                    assert(false, 'should not reach here');
                });
            });
        });

        return resultGrid;
    };

    let getValidPositions = (grid, position) => {
        let [r, c] = position;
        return [
            position,
            [r - 1, c],
            [r + 1, c],
            [r, c + 1],
            [r, c - 1],
        ].filter(pos => {
            let [row, col] = pos;
            return grid[row] && grid[row][col] === '.';
        });
    };

    let traverseBlizzard = (grid, startPosition, endPosition) => {
        let queue = [startPosition];
        let round = 0;
        while (true) {
            let nextPositionsMap = {};

            // blizzard moves happen before rounds:
            grid = makeBlizzardMoves(grid);

            while (queue.length) {
                let position = queue.shift();

                let validNextPositions = getValidPositions(grid, position);
                validNextPositions.forEach(pos => nextPositionsMap[pos.join(',')] = true);
            }

            round++;

            if (nextPositionsMap[endPosition.join(',')]) {
                return [grid, round];
            }

            let nextPositions = Object.keys(nextPositionsMap).map(key => key.split(',').map(n => parseInt(n, 10)));
            if (!nextPositions.length) {
                assert(false, `ran out of positions, guess you are snowed in`);
            }

            if (round > 100 * 1000) {
                assert(false, 'keep the infinite stuff to a minimum');
            }

            queue = nextPositions;
        }

        assert(false, 'how did you even get here?');
    };

    let part2 = (rawInput) => {
        let grid = parseInputToGrid(rawInput);
        let startPosition = [0, grid[0].indexOf('.')];
        let endPosition = [grid.length -1, last(grid).indexOf('.')];

        let rounds = 0;
        let roundsPerLeg;
        [grid, roundsPerLeg] = traverseBlizzard(grid, startPosition, endPosition);
        rounds += roundsPerLeg;
        [grid, roundsPerLeg] = traverseBlizzard(grid, endPosition, startPosition);
        rounds += roundsPerLeg;
        [grid, roundsPerLeg] = traverseBlizzard(grid, startPosition, endPosition);
        rounds += roundsPerLeg;
        return rounds;
    }

    let part1 = (rawInput) => {
        let grid = parseInputToGrid(rawInput);
        let startPosition = [0, grid[0].indexOf('.')];
        let endPosition = [grid.length -1, last(grid).indexOf('.')];

        return traverseBlizzard(grid, startPosition, endPosition)[1];
    };

    return [part1, part2];
})();
