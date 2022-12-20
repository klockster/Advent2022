var day20 = (() => {

    let parseInputToNumbers = (rawInput) => {
        return rawInput.split(/\n/).filter(el => el.length).map(num => parseInt(num));
    }

    let mixNumbers = (numbers, rounds = 1) => {
        let numbersWithInfo = numbers.map((num, i) => ({ num, originalIndex: i}));

        for (let r = 0; r < rounds; r++) {
            for (let i = 0; i < numbersWithInfo.length; i++) {
                let currentIndex = numbersWithInfo.findIndex(el => i === el.originalIndex);
                assert(currentIndex !== -1, 'need to find an index');
                let currentNum = numbersWithInfo[currentIndex];

                numbersWithInfo.splice(currentIndex, 1);
                let nextIndex = (currentIndex + currentNum.num + numbersWithInfo.length) % numbersWithInfo.length;
                nextIndex = nextIndex === 0 ? numbersWithInfo.length : nextIndex;
                numbersWithInfo.splice(
                    nextIndex,
                    0,
                    currentNum
                );
            }
        }

        return numbersWithInfo.map(n => n.num);
    };

    let part2 = (rawInput) => {
        let numbers = parseInputToNumbers(rawInput).map(num => num * 811589153);
        let mixedNumbers = mixNumbers(numbers, 10);

        let zeroIndex = mixedNumbers.findIndex(el => el === 0);
        let [first, second, third] = [
            mixedNumbers[(zeroIndex + 1000) % mixedNumbers.length],
            mixedNumbers[(zeroIndex + 2000) % mixedNumbers.length],
            mixedNumbers[(zeroIndex + 3000) % mixedNumbers.length],
        ];

        return first + second + third;
    };

    let part1 = (rawInput) => {
        let mixedNumbers = mixNumbers(parseInputToNumbers(rawInput));

        let zeroIndex = mixedNumbers.findIndex(el => el === 0);
        let [first, second, third] = [
            mixedNumbers[(zeroIndex + 1000) % mixedNumbers.length],
            mixedNumbers[(zeroIndex + 2000) % mixedNumbers.length],
            mixedNumbers[(zeroIndex + 3000) % mixedNumbers.length],
        ];

        return first + second + third;
    };

    return [part1, part2];
})();
