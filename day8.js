var day8 = (() => {
    let getGrid = (rawInput) => {
        let rows = rawInput.split(/\n/).filter(el => el);
        return rows.map(row => row.split('').map(num => parseInt(num, 10)));
    };

    let getColumn = (grid, colIndex) => grid.map(row => row[colIndex]);

    let slicesAroundIndex = (grid, rowIndex, colIndex) => {
        let result = [];
        let row = grid[rowIndex];
        result.push(row.slice(0, colIndex).reverse(), row.slice(colIndex + 1));

        let column = getColumn(grid, colIndex);
        result.push(column.slice(0, rowIndex).reverse(), column.slice(rowIndex + 1));
        return result;
    };

    let treeAtIndexIsVisible = (grid, rowIndex, colIndex) => {
        let treeHeight = grid[rowIndex][colIndex];
        return slicesAroundIndex(grid, rowIndex, colIndex).find(trees => trees.every(tree => tree < treeHeight));
    };

    let getNumVisibleTrees = (rawInput) => {
        let treeGrid = getGrid(rawInput);
        let visibleTrees = 0;
        treeGrid.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (treeAtIndexIsVisible(treeGrid, rowIndex, colIndex)) {
                    visibleTrees++;
                }
            });
        });

        return visibleTrees;
    };

    let getHighestScenicScore = (rawInput) => {
        let treeGrid = getGrid(rawInput);
        let highestScenicScore = -1;

        treeGrid.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                let tree = col;
                let score = slicesAroundIndex(treeGrid, rowIndex, colIndex)
                    .map(slice => {
                        let idx = slice.findIndex(el => el >= tree);
                        return idx === -1 ? slice.length : idx + 1;
                    })
                    .reduce((a, e) => a * e, 1);

                highestScenicScore = Math.max(score, highestScenicScore);
            });
        });

        return highestScenicScore;
    };

    return [getNumVisibleTrees, getHighestScenicScore];
})();
