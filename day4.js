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

    return [
        getCountOfContained,
        getCountOfOverlap,
    ];
})();

