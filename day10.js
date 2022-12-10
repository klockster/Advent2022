var day10 = (() => {
    let part2 = (rawInput) => {
        let lines = rawInput.split(/\n/).filter(el => el);

        let registerValue = 1;
        let cycles = 0;

        let result = [];

        let incrementCycles = () => {
            // so when the display moves to a new row, the position resets:
            let displayPosition = cycles % 40;

            let nextPixel = Math.abs(displayPosition - registerValue) <= 1 ? '#' : '.'
            result.push(nextPixel);
            cycles++;
        };

        lines.forEach(line => {
            if (line.match(/^noop/)) {
                incrementCycles();
                return;
            }

            assert(line.match(/^addx/), 'line must either be noop or addx instruction');
            let [add, num] = line.split(/\s+/);
            // addx takes 2 cycles to run:
            incrementCycles();
            incrementCycles();

            num = parseInt(num, 10);
            registerValue += num;
        });

        return arrayChunk(result, 40).map(row => row.join('')).join("\n");
    };

    let part1 = (rawInput) => {
        let lines = rawInput.split(/\n/).filter(el => el);

        let registerValue = 1;

        let cycles = 0;
        let result = 0;
        let incrementCycles = () => {
            cycles++;
            if (cycles === 20 || ((cycles - 20) % 40 === 0)) {
                result += cycles * registerValue;
            }
        };

        lines.forEach(line => {
            if (line.match(/^noop/)) {
                incrementCycles();
                return;
            }

            assert(line.match(/^addx/), 'line must either be noop or addx instruction');

            let [add, num] = line.split(/\s+/);
            // addx takes 2 cycles to run:
            incrementCycles();
            incrementCycles();

            num = parseInt(num, 10);
            registerValue += num;
        });

        assert(cycles < 260, 'just in case');

        return result;
    };

    return [part1, part2];
})();
