var day9 = (() => {
    const UP = 'U'
    const DOWN = 'D'
    const LEFT = 'L'
    const RIGHT = 'R'

    let addVectors = (vecA, vecB) => {
        return {
            x: vecA.x + vecB.x,
            y: vecA.y + vecB.y,
        };
    };

    let subtractVectors = (vecA, vecB) => ({ x: vecA.x - vecB.x, y: vecA.y - vecB.y});

    let isTailMoveNeeded = (newHeadPosition, tailPosition) => {
        return Object.values(subtractVectors(newHeadPosition, tailPosition)).map(el => Math.abs(el))
            .find(el => el >= 2);
    };

    let moveTailToCatchUp = (headPosition, tailPosition) => {
        if (!isTailMoveNeeded(headPosition, tailPosition)) {
            return [headPosition, tailPosition];
        }

        let dist = subtractVectors(headPosition, tailPosition);

        let tailDisplacement = {
            x: dist.x === 0 ? 0 : Math.sign(dist.x) * 1,
            y: dist.y === 0 ? 0 : Math.sign(dist.y) * 1,
        };

        return [headPosition, addVectors(tailPosition, tailDisplacement)];
    };

    let simulateStep = (headPosition, tailPosition, stepDirection) => {
        let headDisplacement = {
            x: stepDirection === LEFT ? -1 : stepDirection === RIGHT ? 1 : 0,
            y: stepDirection === DOWN ? -1 : stepDirection === UP ? 1 : 0,
        };

        let resultHeadPosition = addVectors(headPosition, headDisplacement);
        return moveTailToCatchUp(resultHeadPosition, tailPosition);
    };

    let getPositionKey = (position) => {
        return `x:${position.x},y:${position.y}`;
    };

    let getUniqueTailPositions = (rawInput) => {
        let instructions = rawInput.split(/\n/)
            .filter(el => el)
            .map(el => el.split(/\s+/))
            .map(el => [el[0], parseInt(el[1], 10)]);

        let headPosition = {x: 0, y: 0};
        let tailPosition = {x: 0, y: 0};
        let visitedTailPositions = {};
        visitedTailPositions[getPositionKey(tailPosition)] = true;

        instructions.forEach(instruction => {
            let [stepDirection, times] = instruction;
            for (let i = 0; i < times; i++) {
                [headPosition, tailPosition] = simulateStep(headPosition, tailPosition, stepDirection);
                visitedTailPositions[getPositionKey(tailPosition)] = true;
            }
        });

        return Object.keys(visitedTailPositions).length;
    };

    let getUniqueTailPositionsLongerRope = (rawInput) => {
        let instructions = rawInput.split(/\n/)
            .filter(el => el)
            .map(el => el.split(/\s+/))
            .map(el => [el[0], parseInt(el[1], 10)]);

        let ropePositions = (new Array(10)).fill(1).map(el => ({x: 0, y: 0}));
        let visitedTailPositions = {};
        visitedTailPositions[getPositionKey(last(ropePositions))] = true;

        instructions.forEach(instruction => {
            let [stepDirection, times] = instruction;
            for (let i = 0; i < times; i++) {
                [ropePositions[0], ropePositions[1]] = simulateStep(ropePositions[0], ropePositions[1], stepDirection);
                for (let i = 1; i < ropePositions.length - 1; i++) {
                    [ropePositions[i], ropePositions[i + 1]] = moveTailToCatchUp(ropePositions[i], ropePositions[i + 1]);
                }

                visitedTailPositions[getPositionKey(last(ropePositions))] = true;
            }
        });

        return Object.keys(visitedTailPositions).length;
    };

    return [getUniqueTailPositions, getUniqueTailPositionsLongerRope];
})();
