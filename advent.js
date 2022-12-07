
let assert = (assertion, message) => {
    if (!assertion) {
        throw `Assertion failed: ${message}`;
    }
};

let numericSortLowestToHighest = (arr) => {
    return arr.sort(numericSortLowestToHighestComparator);
};

let numericSortLowestToHighestComparator = (a, b) => a > b ? 1 : (b > a) ? -1 : 0;

let last = (arr) => arr[arr.length - 1];

let arrayChunk = (arr, chunkSize = 1) => {
    assert(chunkSize > 0, 'expected `chunkSize` to be at least 1');
    let result = [];
    let row = [];
    for (let i = 0; i < arr.length; i++) {
        if (i % chunkSize === 0) {
            if (row.length) {
                result.push(row);
            }
            row = [];
        }

        row.push(arr[i]);
    }

    if (row.length) {
        result.push(row);
    }

    return result;
};

let stringToLetterSet = (str) => {
    let result = {};
    for (let i = 0; i < str.length; i++) {
        result[str[i]] = true;
    }

    return result;
}

var day7 = (() => {
    let lineIsCommand = (line) => line.match(/^\$ /);

    let getUniqueSuffix = (() => {
        let count = 0
        return () => ++count;
    })();

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

        return allSizes;
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

    return part2;
    // return part1;
})();

var day6 = (() => {
    let processUntilWindowIsUnique = (line, windowLength = 4) => {
        let lettersToCounts = {};
        let firstWindow = line.slice(0, windowLength);

        firstWindow.split('').forEach(letter => lettersToCounts[letter] = (lettersToCounts[letter] || 0) + 1);

        let uniqueLettersInWindow = Object.keys(lettersToCounts).length;
        let lettersProcessed = windowLength;

        if (uniqueLettersInWindow === windowLength) {
            return lettersProcessed;
        }

        for (let i = windowLength; i < line.length; i++) {
            lettersProcessed++;

            let nextLetter = line[i];
            let outgoingLetter = line[i - windowLength];

            if (lettersToCounts[outgoingLetter] === 1) {
                delete lettersToCounts[outgoingLetter];
                uniqueLettersInWindow--;
            } else {
                lettersToCounts[outgoingLetter]--;
            }

            if (lettersToCounts[nextLetter]) {
                lettersToCounts[nextLetter]++;
            } else {
                lettersToCounts[nextLetter] = 1;
                uniqueLettersInWindow++;
            }

            if (uniqueLettersInWindow === windowLength) {
                return lettersProcessed;
            }

        };

        assert(false, 'This should be unreachable');
    };

    let unitTests = () => {
        let stringsToExpected = {
            'bvwbjplbgvbhsrlpgdmjqwftvncz': 5,
            'nppdvjthqldpwncqszvftbrmjlhg': 6,
            'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg': 10,
            'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw': 11,
        };

        Object.keys(stringsToExpected).forEach(str => {
            let expected = stringsToExpected[str];
            let actual = processUntilWindowIsUnique(str);
            assert(actual === expected, `failed on string ${str}, expected: ${expected} got ${actual}`);
        });

        let part2StringsToExpected = {
            'mjqjpqmgbljsphdztnvjfqwrcgsmlb': 19,
            'bvwbjplbgvbhsrlpgdmjqwftvncz': 23,
            'nppdvjthqldpwncqszvftbrmjlhg': 23,
            'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg': 29,
            'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw': 26,
        };

        Object.keys(stringsToExpected).forEach(str => {
            let expected = part2StringsToExpected[str];
            let actual = processUntilWindowIsUnique(str, 14);
            assert(actual === expected, `failed on string ${str}, expected: ${expected} got ${actual}`);
        });

        console.log('TESTS PASSED');
    };

    unitTests();

    let getNumberOfLettersIncludingPacketStart = (rawInput) => {
        let line = rawInput.split(/\n/).filter(el => el)[0];
        return processUntilWindowIsUnique(line);
    };

    let getNumberOfLettersIncludingPacketStartPart2 = (rawInput) => {
        let line = rawInput.split(/\n/).filter(el => el)[0];
        return processUntilWindowIsUnique(line, 14);
    };

    // return getNumberOfLettersIncludingPacketStart;
    return getNumberOfLettersIncludingPacketStartPart2;

})();

var day5 = (() => {
    let getInitialStacks = (cratesInputStr) => {
        // assume crate numbers are single digit
        // assume that crate letters are at position 1+4(n-1), where n = stack #
        let result = [];

        let cratesLines = cratesInputStr.split(/\n/).filter(el => el);
        let stacksLines = cratesLines.pop();
        let numStacks = parseInt(stacksLines.match(/(\d)\s*$/)[1], 10);
        for (let i = 0; i < numStacks; i++) {
            result.push([]);
        }

        let caps = stringToLetterSet('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        assert(Object.keys(caps).length === 26, 'need 26 capital letters');

        cratesLines.forEach(line => {
            for (let i = 0; i < numStacks; i++) {
                let possibleCrate = line[1 + 4 * i];
                if (caps[possibleCrate]) {
                    result[i].unshift(possibleCrate);
                }
            }
        });

        return result;
    };

    let getMoveInstructionSets = (rawMoveInstructions) => {
        return rawMoveInstructions.split(/\n/).filter(el => el).map(el => {
            let [amount, from, dest] = el.match(/\d+/g).map(num => parseInt(num, 10));
            return {
                amount,
                from,
                dest,
            };
        });
    };

    let runMoveInstructions = (crates, moveInstructions) => {
        moveInstructions.forEach(instruction => {
            for (let i = 0; i < instruction.amount; i++) {
                crates[instruction.dest - 1].push(
                    crates[instruction.from - 1].pop()
                );
            }
        });

        return crates;
    };

    let processCrateMoves = (rawInput) => {
        let [cratesInput, rawMoveInstructions] = rawInput.split(/\n\n/);
        let crates = getInitialStacks(cratesInput);
        let moveInstructions = getMoveInstructionSets(rawMoveInstructions);
        crates = runMoveInstructions(crates, moveInstructions);
        return crates.reduce((a, e) => a + last(e), '');
    };

    let runMoveInstructions9001 = (crates, moveInstructions) => {
        moveInstructions.forEach(instruction => {
            let movedCrates = [];
            for (let i = 0; i < instruction.amount; i++) {
                movedCrates.push(crates[instruction.from - 1].pop());
            }

            // could also just do `push(...movedCrates.reverse())` I think
            while (movedCrates.length) {
                crates[instruction.dest - 1].push(movedCrates.pop());
            }
        });

        return crates;
    };

    let process9001CrateMoves = (rawInput) => {
        let [cratesInput, rawMoveInstructions] = rawInput.split(/\n\n/);
        let crates = getInitialStacks(cratesInput);
        let moveInstructions = getMoveInstructionSets(rawMoveInstructions);
        crates = runMoveInstructions9001(crates, moveInstructions);
        return crates.reduce((a, e) => a + last(e), '');
    };

    // return processCrateMoves;
    return process9001CrateMoves;

})();


var day4 = (() => {
    let rangeFullyContained = (rangeA, rangeB) => {
        return (rangeA[0] <= rangeB[0] && rangeA[1] >= rangeB[1]) ||
            (rangeB[0] <= rangeA[0] && rangeB[1] >= rangeA[1]);
    };

    let rangesOverlap = (rangeA, rangeB) => {
        let noOverlap = rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1];
        return !noOverlap;
    };

    let parseInputToRangePairs = (rawInput) => {
        return rawInput.split(/\n/).filter(el => el).map(el => {
            // ok, el is something like "2-5,7-10"
            let pair = el.split(',');
            return pair.map(p => p.split('-').map(num => parseInt(num, 10)));
        });
    };

    let getCountOfContained = (rawInput) => {
        let rangePairs = parseInputToRangePairs(rawInput);
        return rangePairs.filter(el => rangeFullyContained(...el)).length;
    };

    let getCountOfOverlap = (rawInput) => {
        let rangePairs = parseInputToRangePairs(rawInput);
        return rangePairs.filter(el => rangesOverlap(...el)).length;
    };

    return getCountOfOverlap;
    // return getCountOfContained;
})();

var day3 = (() => {
    let getRucksacks = (rawInput) => {
        return rawInput.split(/\n/).filter(el => el);
    };

    let findDupedItem = (rucksack) => {
        assert(rucksack.length % 2 === 0, 'expected rucksack lengths to be even');

        let [part1, part2] = [rucksack.slice(0, rucksack.length / 2), rucksack.slice(rucksack.length / 2)];
        assert(
            part1.length === part2.length && part1.length + part2.length === rucksack.length,
            'expected lengths of parts to be equal and sum to the original length'
        );

        let part2Letters = stringToLetterSet(part2);
        for (let i = 0; i < part1.length; i++) {
            if (part2Letters[part1[i]]) {
                return part1[i];
            }
        }

        assert(false, 'Expected at least 1 duplicate letter');
    };

    let letterSet = null;
    let getItemPriority = (item) => {
        if (letterSet === null) {
            letterSet = {};
            let letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            assert(letters.length === 26 * 2, 'expected the full alphabet twice');

            for (let i = 0; i < letters.length; i++) {
                letterSet[letters[i]] = i + 1;
            }
        }

        assert(letterSet[item] !== undefined, 'expected duped items in the letterSet');
        return letterSet[item];
    };

    let sumDupedItemPriorities = (rawInput) => {
        let rucksacks = getRucksacks(rawInput);
        return rucksacks.map(el => getItemPriority(findDupedItem(el))).reduce((a, e) => a + e, 0);
    };

    let getTriplets = (rawInput) => {
        let rows = rawInput.split(/\n/).filter(el => el);
        let triplets = arrayChunk(rows, 3);
        // we only have to assert the last group's length:
        assert(last(triplets).length === 3, 'expected all groups to have 3 members');
        return triplets;
    };

    let getDupedItemAcrossGroups = (...groups) => {
        assert(groups.length > 1, 'expected at least 2 groups to compare');
        let check = groups.pop();

        let testSets = groups.map(el => stringToLetterSet(el));
        for (let i = 0; i < check.length; i++) {
            let letter = check[i];
            if (testSets.every(el => el[letter])) {
                return letter;
            }
        }

        assert(false, 'expected at least 1 duped item across these groups');
    };

    let sumBadgeItemPriorities = (rawInput) => {
        return getTriplets(rawInput)
            .map(el => getDupedItemAcrossGroups(...el))
            .map(el => getItemPriority(el))
            .reduce((a, e) => a + e, 0);
    };

    // return sumDupedItemPriorities;
    return sumBadgeItemPriorities;

})();

var day2 = (() => {
    let example = `
A Y
B X
C Z
`;

    let opponentKeys = {
        'A': 'rock',
        'B': 'paper',
        'C': 'scissors',
    };
    let yourKeys = {
        'X': 'rock',
        'Y': 'paper',
        'Z': 'scissors',
    };
    let playPoints = {
        'rock': 1,
        'paper': 2,
        'scissors': 3,
    };
    let outcomePoints = {
        'loss': 0,
        'draw': 3,
        'win': 6,
    };

    let scoreRound = (theirMove, yourMove) => {
        let playScore = playPoints[yourMove];

        if (yourMove === theirMove) {
            return 3 + playScore;
        }

        switch (yourMove) {
            case 'rock':
                return theirMove === 'paper' ? playScore : 6 + playScore;
            case 'paper':
                return theirMove === 'scissors' ? playScore : 6 + playScore;
            case 'scissors':
                return theirMove === 'rock' ? playScore : 6 + playScore;
            default:
                throw 'uh oh';
        }

        throw 'oh no';
    };

    let part1MapKeysToMoves = (keys) => {
        let [theirMoveKey, yourMoveKey] = keys;
        let yourMove = yourKeys[yourMoveKey];
        let theirMove = opponentKeys[theirMoveKey];
        return [theirMove, yourMove];
    };

    let part1ScoreCalculate = (rawInput) => {
        let getRounds = rawInput.split(/\n/).filter(el => el).map(el => el.trim().split(/\s+/));
        return getRounds.reduce((a, e) => a + scoreRound(...part1MapKeysToMoves(e)), 0);
    };

    let desiredOutcomes = {
        'X': 'lose',
        'Y': 'draw',
        'Z': 'win',
    };

    let getPlays = (theirMoveKey, desiredOutcomeKey) => {
        let theirMove = opponentKeys[theirMoveKey];

        switch (desiredOutcomes[desiredOutcomeKey]) {
            case 'lose':
                return theirMove === 'rock' ?
                    [theirMove, 'scissors'] :
                    theirMove === 'paper' ? [theirMove, 'rock'] : [theirMove, 'paper'];
            case 'draw':
                return [theirMove, theirMove];
            case 'win':
                return theirMove === 'rock' ?
                    [theirMove, 'paper'] :
                    theirMove === 'paper' ? [theirMove, 'scissors'] : [theirMove, 'rock'];
            default:
                throw `Unexpected desired outcome key ${desiredOutcomeKey}`;
        }

        throw `LogicException: this should be unreachable`;
    };

    let part2ScoreCalculate = (rawInput) => {
        let getRounds = rawInput.split(/\n/).filter(el => el).map(el => el.trim().split(/\s+/));
        return getRounds.reduce((a, e) => a + scoreRound(...getPlays(...e)), 0);
    };

    // return part1ScoreCalculate
    return part2ScoreCalculate
})();

var day1 = (() => {

    let example = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`;

    let getCalorieListsPerElf = (rawListStr) => {
        return rawListStr.split(/\n\n/)
            .map(a => a.split(/\n/).filter(el => el.match(/\d+/)).map(el => parseInt(el, 10)));
    };

    let highestCalories = (rawListStr) => {
        let calorieListPerElf = getCalorieListsPerElf(rawListStr);
        let sumCaloriesPerElf = calorieListPerElf.map(el => el.reduce((a, e) => a + e, 0));
        return Math.max(...sumCaloriesPerElf);
    };

    // let part1 = highestCalories;

    let topThreeTotalCalories = (rawListStr) => {
        let calorieListPerElf = getCalorieListsPerElf(rawListStr);
        let sumCaloriesPerElf = calorieListPerElf.map(el => el.reduce((a, e) => a + e, 0));

        let sortedCaloriesPerElf = sumCaloriesPerElf.sort(numericSortLowestToHighestComparator);

        return sortedCaloriesPerElf.reverse().slice(0, 3).reduce((a, e) => a + e, 0);
    };

    return topThreeTotalCalories;

})();

document.querySelector('button.run-today').addEventListener('click', e => {
    let button = e.target;
    let input = document.querySelector('.problem-input').value;
    let day = button.dataset.day;
    let answer = window[`day${day}`](input);
    console.log(answer);
    document.querySelector('.answer').innerText = answer;
});

