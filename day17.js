var day17 = (() => {
    const ROCK_TYPE_MINUS = 'minus';
    const ROCK_TYPE_PLUS = 'plus';
    const ROCK_TYPE_REVERSE_L = 'reverse-l';
    const ROCK_TYPE_WALL = 'wall';
    const ROCK_TYPE_BOX = 'box';

    let getRockOfTypeOnHeight = (rockType, lowestPointHeight) => {
        // the anchor position for each rock is the upper-leftmost portion of
        // a rectangle enclosing that rock. For some rocks that may mean it
        // is not actually part of the rock (ie: empty space)
        let anchorPos;
        let canMoveDown = (downmostPoints, grid) => {
            return !downmostPoints.find(point => {
                let [x, y] = point;
                return y === 0 || (grid[y - 1] && grid[y - 1][x] === '#');
            });
        };
        let canMoveLeft = (leftmostPoints, grid) => {
            return !leftmostPoints.find(point => {
                let [x, y] = point;
                return x === 0 || (grid[y] && grid[y][x - 1] === '#');
            });
        };
        let canMoveRight = (rightmostPoints, grid) => {
            return !rightmostPoints.find(point => {
                let [x, y] = point;
                return x === 6 || (grid[y] && grid[y][x + 1] === '#');
            });
        };

        switch (rockType) {
            case ROCK_TYPE_MINUS:
                anchorPos = {x: 2, y: lowestPointHeight};
                return {
                    anchorPos,
                    moveLeft: (grid) => {
                        if (canMoveLeft([[anchorPos.x, anchorPos.y]], grid)) {
                            anchorPos.x -= 1;
                            return true;
                        }
                        return false;
                    },
                    moveRight: (grid) => {
                        if (canMoveRight([[anchorPos.x + 3, anchorPos.y]], grid)) {
                            anchorPos.x += 1;
                            return true;
                        }
                        return false;
                    },
                    moveDown: (grid) => {
                        if (canMoveDown([
                            [anchorPos.x, anchorPos.y],
                            [anchorPos.x + 1, anchorPos.y],
                            [anchorPos.x + 2, anchorPos.y],
                            [anchorPos.x + 3, anchorPos.y],
                        ], grid)) {
                            anchorPos.y -= 1;
                            return true;
                        }
                        return false;
                    },
                    drawOnGrid: (grid) => {
                        for (let x = anchorPos.x; x <= anchorPos.x + 3; x++) {
                            grid[anchorPos.y][x] = '#';
                        }
                    },
                };
            case ROCK_TYPE_PLUS:
                anchorPos = {x: 2, y: lowestPointHeight + 2};
                return {
                    anchorPos,
                    moveLeft: (grid) => {
                        if (canMoveLeft([
                            [anchorPos.x + 1, anchorPos.y],
                            [anchorPos.x, anchorPos.y - 1],
                            [anchorPos.x + 1, anchorPos.y - 2],
                        ], grid)) {
                            anchorPos.x -= 1;
                            return true;
                        }
                        return false;
                    },
                    moveRight: (grid) => {
                        if (canMoveRight([
                            [anchorPos.x + 1, anchorPos.y],
                            [anchorPos.x + 2, anchorPos.y - 1],
                            [anchorPos.x + 1, anchorPos.y - 2],
                        ], grid)) {
                            anchorPos.x += 1;
                            return true;
                        }
                        return false;
                    },
                    moveDown: (grid) => {
                        if (canMoveDown([
                            [anchorPos.x, anchorPos.y - 1],
                            [anchorPos.x + 1, anchorPos.y - 2],
                            [anchorPos.x + 2, anchorPos.y - 1],
                        ], grid)) {
                            anchorPos.y -= 1;
                            return true;
                        }
                        return false;
                    },
                    drawOnGrid: (grid) => {
                        [
                            [anchorPos.x + 1, anchorPos.y],
                            [anchorPos.x, anchorPos.y - 1],
                            [anchorPos.x + 1, anchorPos.y - 1],
                            [anchorPos.x + 2, anchorPos.y - 1],
                            [anchorPos.x + 1, anchorPos.y - 2],
                        ].forEach(point => {
                            let [x, y] = point;
                            grid[y][x] = '#';
                        });
                    },
                };
            case ROCK_TYPE_REVERSE_L:
                anchorPos = {x: 2, y: lowestPointHeight + 2};
                return {
                    anchorPos,
                    moveLeft: (grid) => {
                        if (canMoveLeft([
                            [anchorPos.x + 2, anchorPos.y],
                            [anchorPos.x + 2, anchorPos.y - 1],
                            [anchorPos.x, anchorPos.y - 2],
                        ], grid)) {
                            anchorPos.x -= 1;
                            return true;
                        }
                        return false;
                    },
                    moveRight: (grid) => {
                        if (canMoveRight([
                            [anchorPos.x + 2, anchorPos.y],
                            [anchorPos.x + 2, anchorPos.y - 1],
                            [anchorPos.x + 2, anchorPos.y - 2],
                        ], grid)) {
                            anchorPos.x += 1;
                            return true;
                        }
                        return false;
                    },
                    moveDown: (grid) => {
                        if (canMoveDown([
                            [anchorPos.x, anchorPos.y - 2],
                            [anchorPos.x + 1, anchorPos.y - 2],
                            [anchorPos.x + 2, anchorPos.y - 2],
                        ], grid)) {
                            anchorPos.y -= 1;
                            return true;
                        }
                        return false;
                    },
                    drawOnGrid: (grid) => {
                        [
                            [anchorPos.x + 2, anchorPos.y],
                            [anchorPos.x + 2, anchorPos.y - 1],
                            [anchorPos.x, anchorPos.y - 2],
                            [anchorPos.x + 1, anchorPos.y - 2],
                            [anchorPos.x + 2, anchorPos.y - 2],
                        ].forEach(point => {
                            let [x, y] = point;
                            grid[y][x] = '#';
                        });
                    },
                };
            case ROCK_TYPE_WALL:
                anchorPos = {x: 2, y: lowestPointHeight + 3};
                return {
                    anchorPos,
                    moveLeft: (grid) => {
                        if (canMoveLeft([
                            [anchorPos.x, anchorPos.y],
                            [anchorPos.x, anchorPos.y - 1],
                            [anchorPos.x, anchorPos.y - 2],
                            [anchorPos.x, anchorPos.y - 3],
                        ], grid)) {
                            anchorPos.x -= 1;
                            return true;
                        }
                        return false;
                    },
                    moveRight: (grid) => {
                        if (canMoveRight([
                            [anchorPos.x, anchorPos.y],
                            [anchorPos.x, anchorPos.y - 1],
                            [anchorPos.x, anchorPos.y - 2],
                            [anchorPos.x, anchorPos.y - 3],
                        ], grid)) {
                            anchorPos.x += 1;
                            return true;
                        }
                        return false;
                    },
                    moveDown: (grid) => {
                        if (canMoveDown([
                            [anchorPos.x, anchorPos.y - 3],
                        ], grid)) {
                            anchorPos.y -= 1;
                            return true;
                        }
                        return false;
                    },
                    drawOnGrid: (grid) => {
                        [
                            [anchorPos.x, anchorPos.y],
                            [anchorPos.x, anchorPos.y - 1],
                            [anchorPos.x, anchorPos.y - 2],
                            [anchorPos.x, anchorPos.y - 3],
                        ].forEach(point => {
                            let [x, y] = point;
                            grid[y][x] = '#';
                        });
                    },
                };
            case ROCK_TYPE_BOX:
                anchorPos = {x: 2, y: lowestPointHeight + 1};
                return {
                    anchorPos,
                    moveLeft: (grid) => {
                        if (canMoveLeft([
                            [anchorPos.x, anchorPos.y],
                            [anchorPos.x, anchorPos.y - 1],
                        ], grid)) {
                            anchorPos.x -= 1;
                            return true;
                        }
                        return false;
                    },
                    moveRight: (grid) => {
                        if (canMoveRight([
                            [anchorPos.x + 1, anchorPos.y],
                            [anchorPos.x + 1, anchorPos.y - 1],
                        ], grid)) {
                            anchorPos.x += 1;
                            return true;
                        }
                        return false;
                    },
                    moveDown: (grid) => {
                        if (canMoveDown([
                            [anchorPos.x, anchorPos.y - 1],
                            [anchorPos.x + 1, anchorPos.y - 1],
                        ], grid)) {
                            anchorPos.y -= 1;
                            return true;
                        }
                        return false;
                    },
                    drawOnGrid: (grid) => {
                        [
                            [anchorPos.x, anchorPos.y],
                            [anchorPos.x, anchorPos.y - 1],
                            [anchorPos.x + 1, anchorPos.y],
                            [anchorPos.x + 1, anchorPos.y - 1],
                        ].forEach(point => {
                            let [x, y] = point;
                            grid[y][x] = '#';
                        });
                    },
                };
            default:
                assert(false, `Did not recognize ${rockType}`);
        }
    };

    let findTowerHeightOnGrid = (grid) => {
        for (let i = grid.length - 1; i >= 0; i--) {
            let row = grid[i];
            if (row.find(el => el.indexOf('#') > -1)) {
                return i;
            }
        }

        return -1;
    }

    let simulateFallingRocks = (jets, rockCount = 2022, grid = [], rockIndexShift = 0, jetIndexShift = 0) => {
        let rockOrder = [
            ROCK_TYPE_MINUS,
            ROCK_TYPE_PLUS,
            ROCK_TYPE_REVERSE_L,
            ROCK_TYPE_WALL,
            ROCK_TYPE_BOX,
        ];

        let jetIndex = 0;
        for (let i = 0; i < rockCount; i++) {

            let towerHeight = findTowerHeightOnGrid(grid);
            while (grid.length < towerHeight + 8) {
                grid.push(['.', '.', '.', '.', '.', '.', '.']);
            }
            let nextRockHeight = towerHeight + 4;

            let nextRockType = rockOrder[(i + rockIndexShift) % rockOrder.length];
            let nextRock = getRockOfTypeOnHeight(nextRockType, nextRockHeight);

            while (true) {
                let direction = jets[(jetIndex + jetIndexShift) % jets.length];
                jetIndex++;

                if (direction === '<') {
                    nextRock.moveLeft(grid);
                } else {
                    assert(direction === '>', 'direction can only be left or right');
                    nextRock.moveRight(grid);
                }

                let didMoveDown = nextRock.moveDown(grid);
                if (!didMoveDown) {
                    nextRock.drawOnGrid(grid);
                    break
                }
            }
        }

        // towerHeight is really an index, so plus 1 is necessary
        return [findTowerHeightOnGrid(grid) + 1, grid, (jetIndex + jetIndexShift)];
    };

    let part2 = (rawInput) => {
        let jets = rawInput.split(/\n/).filter(el => el)[0];

        // assume there is a pattern that repeats, and we just need to find it.
        // in other words, for certain numbers of rocks (R), the difference between height(R * i) and height(R * (i - 1)) is
        // constant for all i >= 2, and that similarly the position into the `jets` string is also constant for the same R,i

        // in order to find that, start by getting the heights and final jet positins for simulations of rocks from 1 rock up to 10k
        let maxSims = 10000;

        let heights = [];
        let jetShifts = [];

        let grid = [];
        let jetShift = 0;
        let height;
        for (let i = 1; i < maxSims; i++) {
            [height, grid, jetShift] = simulateFallingRocks(jets, 1, grid, i - 1, jetShift);
            heights.push(height);
            jetShifts.push(jetShift);
        }

        let bestDelta = null;
        let bestJetDelta = null;
        let bestIndex = null;

        // then, we look for patterns.
        // divide maxSims by 4 so that the pattern has to be present at least a few times
        for (let i = 1; i < maxSims / 4; i++) {
            let delta = null;
            let jetDelta = null;

            let iterations = 1;
            while (true) {
                let index = i * iterations;
                let nextIndex = index + i;

                iterations++;

                if (!heights[nextIndex]) {
                    if (delta && jetDelta) {
                        // if we're out of room on the heights we simulated, but the delta and jetDelta stayed the same the whole
                        // time, then remember them
                        bestDelta = delta;
                        bestJetDelta = jetDelta;
                        bestIndex = i;
                    }
                    break;
                }

                if (delta === null) {
                    delta = heights[nextIndex] - heights[index];
                    jetDelta = jetShifts[nextIndex] - jetShifts[index];
                    continue;
                }

                if (
                    delta !== heights[nextIndex] - heights[index] ||
                    jetDelta !== jetShifts[nextIndex] - jetShifts[index]
                ) {
                    break;
                }
            }
        }

        // make sure we found something:
        assert(bestDelta !== null && bestIndex !== null && bestJetDelta !== null, 'need to find a pattern to win');

        // at this point we don't care about bestJetDelta anymore, we just needed to care that it was constant

        // simulating N rocks is given by heights[N - 1] or simulateFallingRocks(jets, N);
        // the `bestIndex` represents an index into heights such that heights[bestIndex * M] - heights[bestIndex * (M - 1)] is const
        // where M = 2,3,4...inf
        // that const = bestDelta

        // in order to not have to simulate as much stuff, we'd like to do the following:
        // given `sims` as the number of rocks to simulate, we'd like to find `factor` (how many times bestIndex fits into sims)
        // this gives us the height after `factor * (bestIndex + 1)` rocks, which is equal to
        // `heights[bestIndex] + (delta * (factor - 1))`
        // let sims = 2022;
        let sims = 1000000000000;

        let factor = Math.floor(sims / bestIndex);
        let predictableHeight = heights[bestIndex] + (bestDelta * (factor - 1));

        // we want to find how many simulations need to be run after the predictions, which is our remainder:
        let remainingSimulations = sims - ((factor * bestIndex) + 1);

        // if the pattern reliably repeats, then we need to hope that the pattern + remainingSimulations also repeats
        // otherwise we're screwed.  So this is the answer based on that assumption.
        // in other words, after the [pattern index * any positive integer], if we offset by an additional remainingSimulations,
        // we always offset by the correct amount
        return predictableHeight + (heights[bestIndex + remainingSimulations] - heights[bestIndex]);
    };

    let part1 = (rawInput) => {
        // the input is already parsed the way we want it, more or less
        let jets = rawInput.split(/\n/).filter(el => el)[0];
        return simulateFallingRocks(jets)[0];
    };

    return [part1, part2];
})();
