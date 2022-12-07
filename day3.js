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

    return [sumDupedItemPriorities, sumBadgeItemPriorities];
})();

