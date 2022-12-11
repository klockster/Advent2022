var day11 = (() => {
    let getMonkey = (rawMonkeyInfo) => {
        let lines = rawMonkeyInfo.split(/\n/);
        let items = lines[1].split(': ')[1].split(', ').map(num => parseInt(num, 10));

        let body = lines[2].split(' = ')[1]
        // @TODO: this is terribly not-secure, as bad as eval:
        let operation = new Function('old', `return ${body}`);
        let divBy = parseInt(lines[3].match(/divisible by (\d+)/)[1], 10);
        let trueMonkey = parseInt(lines[4].match(/to monkey (\d+)/)[1], 10);
        let falseMonkey = parseInt(lines[5].match(/to monkey (\d+)/)[1], 10);

        return {
            items,
            operation,
            divBy,
            trueMonkey,
            falseMonkey,
            inspectionCount: 0,
        };
    };

    let getMostActiveMonkeysAfterRounds = (monkeys, roundCount = 20, withRelief = true) => {
        for (let i = 0; i < roundCount; i++) {
            monkeys.forEach(monkey => {
                while (monkey.items.length) {
                    let worryLevel = monkey.items.shift();
                    worryLevel = monkey.operation(worryLevel);
                    if (withRelief) {
                        worryLevel = Math.floor(worryLevel / 3);
                    } else {
                        // @TODO: could hoist this for perf:
                        let factorProduct = monkeys.map(m => m.divBy).reduce((a, e) => a * e, 1);
                        // well, it seems this worked out: we can stay within the modular space whose maximum
                        // is the product of all the divisible-by factors that we want to test, which makes sense
                        // because if we ever reach a multiple of that number and take modulus, it'll spit out 0, which
                        // will pass all the divBy tests (as it should).
                        worryLevel = worryLevel % factorProduct;
                    }

                    if (worryLevel % monkey.divBy === 0) {
                        monkeys[monkey.trueMonkey].items.push(worryLevel);
                    } else {
                        monkeys[monkey.falseMonkey].items.push(worryLevel);
                    }

                    monkey.inspectionCount++;
                }
            });
        }

        return monkeys;
    };

    let monkeyBusinessMagnitude = (rawInput) => {
        let rawMonkeyInfo = rawInput.split(/\n\n/).filter(el => el);
        let monkeys = rawMonkeyInfo.map(info => getMonkey(info));

        return getMostActiveMonkeysAfterRounds(monkeys, 20)
            .map(m => m.inspectionCount)
            .sort(numericSortLowestToHighestComparator)
            .slice(-2)
            .reduce((a, e) => a * e, 1);
    };

    let part2 = (rawInput) => {
        let rawMonkeyInfo = rawInput.split(/\n\n/).filter(el => el);
        let monkeys = rawMonkeyInfo.map(info => getMonkey(info));

        return getMostActiveMonkeysAfterRounds(monkeys, 10000, false)
            .map(m => m.inspectionCount)
            .sort(numericSortLowestToHighestComparator)
            .slice(-2)
            .reduce((a, e) => a * e, 1);
    }

    return [monkeyBusinessMagnitude, part2];
})();
