var day13 = (() => {
    // isPairInOrder returns results like a `sort` comparator
    const IN_ORDER = -1;
    const OUT_OF_ORDER = 1;
    const KEEP_GOING = 0;

    let isPairInOrder = (pair) => {
        // because `.shift` mutates the array, we need to "clone" it here
        let [left, right] = JSON.parse(JSON.stringify(pair));
        let result;

        while (left.length && right.length) {
            let leftElement = left.shift();
            let rightElement = right.shift();

            if (typeof leftElement === 'object') {
                rightElement = (typeof rightElement === 'object') ? rightElement : [rightElement];
                result = isPairInOrder([leftElement, rightElement]);
                if (result !== KEEP_GOING) {
                    return result;
                }
                continue;
            }

            if (typeof rightElement === 'object') {
                leftElement = (typeof leftElement === 'object') ? leftElement : [leftElement];
                result = isPairInOrder([leftElement, rightElement]);
                if (result !== KEEP_GOING) {
                    return result;
                }
                continue;
            }

            assert(typeof leftElement === 'number' && typeof rightElement === 'number');
            result = leftElement < rightElement ?
                IN_ORDER : (rightElement < leftElement) ?
                OUT_OF_ORDER : KEEP_GOING;

            if (result !== KEEP_GOING) {
                return result;
            }
        }

        return left.length === 0 && right.length > 0 ? IN_ORDER :
            left.length > 0 && right.length === 0 ? OUT_OF_ORDER : KEEP_GOING;
    };

    let part2 = (rawInput) => {
        let pairs = rawInput.split(/\n\n/).filter(el => el).map(el => el.split(/\n/).map(l => JSON.parse(l)));

        return pairs
            .concat([[ [[2]], [[6]] ]])
            .flat()
            .sort((a, b) => isPairInOrder([a, b]))
            .map(l => JSON.stringify(l))
            .reduce((a, e, i) => {
                if (e === '[[6]]' || e === '[[2]]') {
                    return a * (i + 1);
                }
                return a;
            }, 1);
    };

    let part1 = (rawInput) => {
        let pairs = rawInput.split(/\n\n/).filter(el => el).map(el => el.split(/\n/).map(l => JSON.parse(l)));
        let inOrderIndexes = pairs.map((pair, index) => {
            return isPairInOrder(pair) === IN_ORDER ? index + 1 : null;
        }).filter(el => el);

        return inOrderIndexes.reduce((a, e) => a + e, 0);
    };

    return [part1, part2];
})();
