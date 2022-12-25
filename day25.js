var day25 = (() => {
    let snafuToDecimal = (numStr) => {
        let conversion = {
            2: 2,
            1: 1,
            0: 0,
            '-': -1,
            '=': -2,
        };

        let result = 0;
        for (let i = 0; i < numStr.length; i++) {
            let digit = numStr[numStr.length - 1 - i];
            let convertedDigit = (conversion[digit]);
            assert(convertedDigit !== undefined);
            result += convertedDigit * Math.pow(5, i);
        }

        return result;
    };

    let decimalToSnafu = (num) => {
        let conversion = {
            '0': 0,
            '1': 1,
            '2': 2,
            '3': '=',
            '4': '-',
        };

        // you can convert the numbers to base5, then apply the following logic:
        // if the digit is 0,1, or 2: just keep that digit and move onto the next (leftward) digit
        // if the number is 3, sub =, or 4, sub -, and then add 1 to the next leftward digit

        let base5 = (num).toString(5);

        let result = '';

        let base5digits = base5.split('');
        while (base5digits.length) {
            let digit = base5digits.pop();
            let convertedDigit = conversion[digit];
            assert(convertedDigit !== undefined, `digit ${digit} did not convert`);

            result = `${convertedDigit}${result}`;
            if (parseInt(digit, 10) > 2) {
                base5digits = (parseInt(
                    base5digits.length ? base5digits.join('') : 0, 5) + 1
                ).toString(5).split('');
            }
        }

        return result;
    };

    let part1 = (rawInput) => {
        let decimal = rawInput.split(/\n/).filter(el => el).map(snafuToDecimal).reduce((a, e) => a + e, 0);
        return decimalToSnafu(decimal);
    };

    return [part1];
})();
