var day21 = (() => {
    let parseInputToMonkeyMap = (rawInput) => {
        let result = {};

        let lines = rawInput.split(/\n/).filter(el => el);
        lines.forEach(line => {
            let [name, op] = line.split(': ');
            if (op.match(/\d+/)) {
                result[name] = (map) => parseInt(op.match(/\d+/)[0], 10);
                return;
            }

            let matches = op.match(/([a-z]{4}) (\+|-|\/|\*) ([a-z]{4})/);
            assert(matches && matches.length > 3, 'need to match input');
            result[name] = (map) => {
                let a = map[matches[1]](map);
                let b = map[matches[3]](map);
                switch (matches[2]) {
                    case '+':
                        return a + b;
                    case '-':
                        return a - b;
                    case '*':
                        return a * b;
                    case '/':
                        return a / b;
                    default:
                        assert(false, 'need to match +-/* op');
                }
            };
        });

        return result;
    };

    let part2 = (rawInput) => {
        let monkeyMap = {};

        let lines = rawInput.split(/\n/).filter(el => el);
        lines.forEach(line => {
            let [name, op] = line.split(': ');
            if (op.match(/\d+/)) {
                monkeyMap[name] = (map) => name === 'humn' ? 'humn' : `${op}`;
                return;
            }

            let matches = op.match(/([a-z]{4}) (\+|-|\/|\*) ([a-z]{4})/);
            assert(matches && matches.length > 3, 'need to match input');

            monkeyMap[name] = (map) => {
                let a = map[matches[1]](map);
                let b = map[matches[3]](map);
                let infix = matches[2];
                if (name === 'root') {
                    infix = '=';
                }
                return `(${a}) ${infix} (${b})`;
            };
        });

        let result = monkeyMap['root'](monkeyMap);
        let [sideA, sideB] = result.split(' = ');

        let knownSide = sideA.indexOf('humn') > -1 ? eval(sideB) : eval(sideA);
        let unknownSideEquation = sideA.indexOf('humn') > -1 ? sideA : sideB;
        let unknownSide;

        let tilt = null;
        // I don't have the patience right now to write something to try to unwind all the parentheses and then solve for 'humn'
        // algebraically, so instead we'll have our fun a different way:
        // assume the answer is a positive integer
        // we have the number we're trying to reach in `knownSide`, and we can make a guess called `unknownSide` which is
        // the number we get when we try a value for `humn` and then evaluate that side with `eval` (yay security)

        // so we go by powers of 10 until the relationship between `knownSide` and `unknownSide` flips
        // that means our answer is in there somewhere, so we drill in with a binary search
        for (let i = 0; i < 14; i++) {
            var humn = Math.pow(10, i);

            unknownSide = sideA.indexOf('humn') > -1 ? eval(sideA) : eval(sideB);
            if (unknownSide === knownSide) {
                return humn;
            } else {
                if (tilt === null) {
                    tilt = unknownSide > knownSide ? 'greater' : 'less';
                    continue;
                }

                let newTilt = unknownSide > knownSide ? 'greater' : 'less';
                if (newTilt !== tilt) {
                    let binarySearch = (min, max, target, eq) => {
                        let half = min + Math.floor((max - min) / 2);
                        humn = half;

                        let guess = eval(eq);
                        if (guess === target) {
                            return humn;
                        }

                        if (min >= max) {
                            assert(false, 'hmmmm');
                        }

                        if (guess > target) {
                            // if your guess relationship to target is the same as when we flipped from tilt to newTilt,
                            // then we need to try a lower number for `humn`, else higher:
                            return newTilt === 'greater' ?
                                binarySearch(min, half - 1, target, eq) :
                                binarySearch(half + 1, max, target, eq);
                        } else {
                            return newTilt === 'greater' ?
                                binarySearch(half + 1, max, target, eq) :
                                binarySearch(min, half - 1, target, eq);
                        }
                    };

                    // we can binary search between 10^(i - 1) and 10^(i)
                    return binarySearch(Math.pow(10, i - 1), Math.pow(10, i), knownSide, unknownSideEquation);
                }
            }
        }

        assert(false, 'need to find some answer');
    };

    let part1 = (rawInput) => {
        let monkeyMap = parseInputToMonkeyMap(rawInput);
        return monkeyMap['root'](monkeyMap);
    };

    return [part1, part2];
})();
