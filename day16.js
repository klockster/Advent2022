var day16 = (() => {
    let parseInputToValves = (rawInput) => {
        let valves = {};
        rawInput.split(/\n/).filter(el => el).forEach(el => {
            let matches = el.match(/Valve ([A-Z]{2}) has flow rate=(\d+); tunnels{0,1} leads{0,1} to valves{0,1} ([A-Z,\s]+)/);
            assert(matches && matches.length > 3, `el ${el} didn't match`);

            let valveName = matches[1];
            let flowRate = parseInt(matches[2], 10);
            let tunnels = matches[3].split(', ');
            valves[valveName] = {
                name: valveName,
                flowRate,
                tunnels,
            };
        });

        return valves;
    };

    // these solutions labeled "naive" are absolute piping-hot garbage
    // I either got stuck in a weird rut of thinking that I couldn't escape
    // or was painfully unaware of some algorithm that's often used for these sorts of things

    // because of the way it culls the stacks it may not work on all inputs

    let naiveWithElephant = (valves) => {
        let stack = [{
            positions: [
                { current: 'AA', prev: null },
                { current: 'AA', prev: null },
            ],
            openValvesSet: {},
            stepsLeft: 26,
            currentPressureReleased: 0,
        }];

        let results = {};
        while (stack.length) {
            iterations++;
            let next = stack.pop();
            let {positions, openValvesSet, stepsLeft, currentPressureReleased} = next;
            if (stepsLeft === 0) {
                results[currentPressureReleased] = true;
                // results.push(currentPressureReleased);
                continue;
            }

            // ok, these are some aggressive culls to keep things in check:
            if (stepsLeft <= 20 && currentPressureReleased < (20 - stepsLeft) * 45) {
                continue;
            }
            if (stepsLeft <= 10 && currentPressureReleased < (10 - stepsLeft) * 100 + 600) {
                continue;
            }

            currentPressureReleased = currentPressureReleased + Object.keys(openValvesSet).reduce((a, e) => {
                return a + valves[e].flowRate;
            }, 0);

            // for each unique position in positions, we want to propose opening a valve if that valve can be opened
            // if we're in 2 different positions that can be opened, we can open A, B, or AB
            let [yourPosition, elephantPosition] = positions;
            if (
                valves[yourPosition.current].flowRate &&
                valves[elephantPosition.current].flowRate &&
                !openValvesSet[yourPosition.current] &&
                !openValvesSet[elephantPosition.current]
            ) {
                stack.push({
                    positions: [
                        { current: yourPosition.current, prev: null },
                        { current: elephantPosition.current, prev: null },
                    ],
                    openValvesSet: {...openValvesSet, [yourPosition.current]: true, [elephantPosition.current]: true },
                    stepsLeft: stepsLeft - 1,
                    currentPressureReleased,
                });
            }

            let yourValve = valves[yourPosition.current];
            let elephantValve = valves[elephantPosition.current];

            if (yourValve.flowRate && !openValvesSet[yourPosition.current]) {
                // we can take a half step:
                elephantValve.tunnels.filter(el => el !== elephantPosition.prev).forEach(tunnel => {
                    stack.push({
                        positions: [{current: yourPosition.current, prev: null}, {current: tunnel, prev: elephantPosition.current}],
                        openValvesSet: {...openValvesSet, [yourPosition.current]: true },
                        stepsLeft: stepsLeft - 1,
                        currentPressureReleased,
                    });
                });
            }
            if (elephantValve.flowRate && !openValvesSet[elephantPosition.current]) {
                // we can take a half step:
                yourValve.tunnels.filter(el => el !== yourPosition.prev).forEach(tunnel => {
                    stack.push({
                        positions: [{current: tunnel, prev: yourPosition.current}, {current: elephantPosition.current, prev: null}],
                        openValvesSet: {...openValvesSet, [elephantPosition.current]: true },
                        stepsLeft: stepsLeft - 1,
                        currentPressureReleased,
                    });
                });
            }

            // and now the combinatorics of both moving
            yourValve.tunnels.filter(el => el !== yourPosition.prev).forEach(yourTunnel => {
                elephantValve.tunnels.filter(el => el !== elephantPosition.prev).forEach(elephantTunnel => {
                    stack.push({
                        positions: [
                            { current: yourTunnel, prev: yourPosition.current },
                            { current: elephantTunnel, prev: elephantPosition.current },
                        ],
                        openValvesSet,
                        stepsLeft: stepsLeft - 1,
                        currentPressureReleased,
                    });
                });
            });
        }

        return last(Object.keys(results).sort(numericSortLowestToHighestComparator));
    };

    let naive = (valves) => {
        let stack = [{ currentValve: 'AA', openValvesSet: {}, stepsLeft: 30, currentPressureReleased: 0, cameFrom: null}];

        let results = [];
        while (stack.length) {
            let next = stack.pop();
            let {currentPressureReleased, openValvesSet, stepsLeft, currentValve, cameFrom} = next;
            if (stepsLeft === 0) {
                results.push(currentPressureReleased);
                continue;
            }

            // heuristics to cull these:
            if (stepsLeft < 25 && currentPressureReleased < ((30 - stepsLeft) * 5)) {
                continue;
            }
            if (stepsLeft < 20 && currentPressureReleased < ((30 - stepsLeft) * 10)) {
                continue;
            }
            if (stepsLeft < 10 && currentPressureReleased < ((30 - stepsLeft) * 30)) {
                continue;
            }

            currentPressureReleased = currentPressureReleased + Object.keys(openValvesSet).reduce((a, e) => {
                return a + valves[e].flowRate;
            }, 0);

            let valve = valves[currentValve];
            if (valve.flowRate > 0 && !openValvesSet[currentValve]) {
                stack.push({
                    currentValve,
                    openValvesSet: {...openValvesSet, [currentValve]: true},
                    stepsLeft: stepsLeft - 1,
                    currentPressureReleased,
                    cameFrom: null,
                });
            }

            valve.tunnels.filter(el => el !== cameFrom).forEach(tunnel => {
                stack.push({
                    currentValve: tunnel,
                    openValvesSet,
                    stepsLeft: stepsLeft - 1,
                    currentPressureReleased,
                    cameFrom: currentValve,
                });
            });
        }

        // lol Math.max is recursive and it blows out the call stack, so instead:
        let max = -1;
        results.forEach(num => {
            if (num > max) {
                max = num;
            }
        });
        return max;
    };

    let part2 = (rawInput) => {
        let valves = parseInputToValves(rawInput);
        return naiveWithElephant(valves);

    };

    // whew, this one is tough, I'm not totally sure where to start....
    let getMostPressureReleased = (rawInput) => {
        let valves = parseInputToValves(rawInput);
        let simulation = naive(valves);
        return simulation;
    };

    return [getMostPressureReleased, part2];
})();
