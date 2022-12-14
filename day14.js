var day14 = (() => {
    let drawLinesOnGrid = (rawLines, grid, withFloor = false) => {
        let rowIndexesUsed = [];

        rawLines.forEach(rawLine => {
            let rawLineEdges = rawLine.split(' -> ');
            for (let i = 0; i < rawLineEdges.length - 1; i++) {
                let [startEdge, endEdge] = rawLineEdges.slice(i, i + 2);

                // I find it easier to work with row/column indexes, but the coordinates we're given are "x,y"
                // "x" is actually which column we're on, and "y" is actually which row we're on, so `reverse`
                // gets us row/column indexes
                let [startRowIndex, startColIndex] = startEdge.split(',').map(el => parseInt(el, 10)).reverse();
                let [endRowIndex, endColIndex] = endEdge.split(',').map(el => parseInt(el, 10)).reverse();

                rowIndexesUsed.push(startRowIndex, endRowIndex);

                assert(startRowIndex === endRowIndex || startColIndex === endColIndex, 'line should be horizontal or vertical');
                if (startRowIndex === endRowIndex) {
                    [startColIndex, endColIndex] = [startColIndex, endColIndex].sort(numericSortLowestToHighestComparator);
                    for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
                        grid[startRowIndex][colIndex] = '#';
                    }
                    continue;
                }

                [startRowIndex, endRowIndex] = [startRowIndex, endRowIndex].sort(numericSortLowestToHighestComparator);
                for (let rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
                    grid[rowIndex][startColIndex] = '#';
                }
            }
        });

        if (withFloor) {
            let floorRowIndex = Math.max(...rowIndexesUsed) + 2;
            for (let i = 0; i < grid[0].length; i++) {
                grid[floorRowIndex][i] = '#';
            }
        }

        return grid;
    };

    let getNextPossibleSandPosition = (grid, currentSandPosition) => {
        let [rowIndex, colIndex] = currentSandPosition;
        return [
            [rowIndex + 1, colIndex],
            [rowIndex + 1, colIndex - 1],
            [rowIndex + 1, colIndex + 1],
        ].filter(pos => {
            let [r, c] = pos;
            return grid[r] && grid[r][c] === '.';
        })[0];
    };

    let getAccumulatedGrainsOfSand = (grid) => {
        let iterations = 0;
        while (true) {
            if (iterations > 30000) {
                assert(false, 'infinite loop maybe');
                break;
            }

            let sandPosition = [0, 500];
            let nextSandPosition;
            while (nextSandPosition = getNextPossibleSandPosition(grid, sandPosition)) {
                sandPosition = nextSandPosition;
            }

            // the possible "done" conditions are either that the sand hit the bottom of the grid
            // or the sand couldn't move past the entry point
            if (sandPosition[0] === grid.length - 1) {
                return iterations;
            }
            // if the final grain of sand comes to rest at the entry point, count it and the others:
            if (sandPosition[0] === 0 && sandPosition[1] === 500) {
                return iterations + 1;
            }

            grid[sandPosition[0]][sandPosition[1]] = 'o';
            iterations++;
        }

        assert(false);
    };

    let part2 = (rawInput) => {
        let lines = rawInput.split(/\n/).filter(el => el);
        // the grid has to be longer to accumulate so much more sand:
        let grid = (new Array(600)).fill(1).map(el => (new Array(900)).fill(1).map(el => '.'));
        grid = drawLinesOnGrid(lines, grid, true);

        return getAccumulatedGrainsOfSand(grid);
    };

    let part1 = (rawInput) => {
        let lines = rawInput.split(/\n/).filter(el => el);
        // creating an empty grid without sharing object references is rough:
        let grid = (new Array(600)).fill(1).map(el => (new Array(600)).fill(1).map(el => '.'));

        grid = drawLinesOnGrid(lines, grid);

        return getAccumulatedGrainsOfSand(grid);
    };

    return [part1, part2];
})();
