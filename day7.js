var day7 = (() => {
    let lineIsCommand = (line) => line.match(/^\$ /);

    let mapDirectoryNamesToSizes = (directory, parentKey = '') => {
        let map = {};
        let currentDirSize = 0;

        Object.keys(directory).forEach(key => {
            if (key === '..') {
                return;
            }

            let value = directory[key];
            if (value instanceof Object) {
                let [subMap, dirSize] = mapDirectoryNamesToSizes(value, `${parentKey}/${key}`);
                map = {...map, ...subMap};
                currentDirSize += dirSize;

                // keeps keys unique
                let mapKey = (parentKey !== '') ? `${parentKey}/${key}` : key;

                map[mapKey] = dirSize;
                return;
            }

            // if we get here, `value` was a file size
            currentDirSize += parseInt(value, 10);
        });

        return [map, currentDirSize];
    };

    let buildDirectoryStructureFromTerminal = (rawInput) => {
        let root = {};
        let lines = rawInput.split(/\n/);

        let currentLevel = root;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (lineIsCommand(line)) {
                if (line.match(/^\$ cd ([^\s]+)/)) {
                    let dirName = line.match(/^\$ cd ([^\s]+)/)[1];
                    if (dirName === '/') {
                        currentLevel = root;
                        continue;
                    }

                    currentLevel[dirName] = (currentLevel[dirName] || {'..': currentLevel})
                    currentLevel = currentLevel[dirName];
                    assert(currentLevel !== null, 'should not traverse .. from root');
                    continue;
                }

                // otherwise the line is "ls"
                let nextLine;
                while ((nextLine = lines[i + 1]) && !lineIsCommand(nextLine)) {
                    // here we process "ls" output
                    i++;
                    if (nextLine.match(/^dir ([^\s]+)/)) {
                        let listedDir = nextLine.match(/^dir ([^\s]+)/)[1];
                        currentLevel[listedDir] = (currentLevel[listedDir] || {'..': currentLevel});
                        continue;
                    }

                    // else it's a file
                    let matches = nextLine.match(/^(\d+) ([^\s]+)/);
                    let fileSize = matches[1];
                    let fileName = matches[2];
                    currentLevel[fileName] = fileSize;
                }

                continue;
            }

            assert(false, 'Should not be able to reach here');
        }

        return root;
    };

    let part1 = (rawInput) => {
        let dir = buildDirectoryStructureFromTerminal(rawInput);
        let [sizeMap, rootSize] = mapDirectoryNamesToSizes(dir);
        let allSizes = {...sizeMap, '/': rootSize};
        let maxSize = 100000;

        return Object.values(allSizes).reduce((a, e) => e <= maxSize ? (a + e) : a, 0);
    };

    // find the smallest directory to delete that would achieve the required free disk space
    let part2 = (rawInput) => {
        let dir = buildDirectoryStructureFromTerminal(rawInput);
        let [sizeMap, rootSize] = mapDirectoryNamesToSizes(dir);
        let allSizes = {...sizeMap, '/': rootSize};

        let usedSpace = allSizes['/'];
        let totalSystemSpace = 70000000;
        let freeSpace = totalSystemSpace - usedSpace;

        let neededFreeSpace = 30000000;
        let minAmountToFree = neededFreeSpace - freeSpace;

        return Object.values(allSizes)
            .sort(numericSortLowestToHighestComparator)
            .find(el => el > minAmountToFree);
    };

    return [part1, part2];
})();

