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

    return [
        getNumberOfLettersIncludingPacketStart,
        getNumberOfLettersIncludingPacketStartPart2,
    ];
})();

