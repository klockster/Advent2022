var day2 = (() => {
    let example = `
A Y
B X
C Z
`;

    let opponentKeys = {
        'A': 'rock',
        'B': 'paper',
        'C': 'scissors',
    };
    let yourKeys = {
        'X': 'rock',
        'Y': 'paper',
        'Z': 'scissors',
    };
    let playPoints = {
        'rock': 1,
        'paper': 2,
        'scissors': 3,
    };
    let outcomePoints = {
        'loss': 0,
        'draw': 3,
        'win': 6,
    };

    let scoreRound = (theirMove, yourMove) => {
        let playScore = playPoints[yourMove];

        if (yourMove === theirMove) {
            return 3 + playScore;
        }

        switch (yourMove) {
            case 'rock':
                return theirMove === 'paper' ? playScore : 6 + playScore;
            case 'paper':
                return theirMove === 'scissors' ? playScore : 6 + playScore;
            case 'scissors':
                return theirMove === 'rock' ? playScore : 6 + playScore;
            default:
                throw 'uh oh';
        }

        throw 'oh no';
    };

    let part1MapKeysToMoves = (keys) => {
        let [theirMoveKey, yourMoveKey] = keys;
        let yourMove = yourKeys[yourMoveKey];
        let theirMove = opponentKeys[theirMoveKey];
        return [theirMove, yourMove];
    };

    let part1ScoreCalculate = (rawInput) => {
        let getRounds = rawInput.split(/\n/).filter(el => el).map(el => el.trim().split(/\s+/));
        return getRounds.reduce((a, e) => a + scoreRound(...part1MapKeysToMoves(e)), 0);
    };

    let desiredOutcomes = {
        'X': 'lose',
        'Y': 'draw',
        'Z': 'win',
    };

    let getPlays = (theirMoveKey, desiredOutcomeKey) => {
        let theirMove = opponentKeys[theirMoveKey];

        switch (desiredOutcomes[desiredOutcomeKey]) {
            case 'lose':
                return theirMove === 'rock' ?
                    [theirMove, 'scissors'] :
                    theirMove === 'paper' ? [theirMove, 'rock'] : [theirMove, 'paper'];
            case 'draw':
                return [theirMove, theirMove];
            case 'win':
                return theirMove === 'rock' ?
                    [theirMove, 'paper'] :
                    theirMove === 'paper' ? [theirMove, 'scissors'] : [theirMove, 'rock'];
            default:
                throw `Unexpected desired outcome key ${desiredOutcomeKey}`;
        }

        throw `LogicException: this should be unreachable`;
    };

    let part2ScoreCalculate = (rawInput) => {
        let getRounds = rawInput.split(/\n/).filter(el => el).map(el => el.trim().split(/\s+/));
        return getRounds.reduce((a, e) => a + scoreRound(...getPlays(...e)), 0);
    };

    return [part1ScoreCalculate, part2ScoreCalculate];
})();

