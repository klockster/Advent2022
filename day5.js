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

    return [
        processCrateMoves,
        process9001CrateMoves,
    ];
})();

