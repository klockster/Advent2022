var day15 = (() => {
    let getSensorsWithBeacons = (rawInput) => {
        return rawInput.split(/\n/)
            .filter(el => el)
            .map(line => {
                let matches = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
                let positionNumbers = matches.slice(1, 5).map(n => parseInt(n, 10));
                let sensorPosition = { x: positionNumbers[0], y: positionNumbers[1] };
                let beaconPosition = { x: positionNumbers[2], y: positionNumbers[3] };
                return {
                    sensor: sensorPosition,
                    beacon: beaconPosition,
                };
            });
    };

    let getManhattanDistance = (posA, posB) => Math.abs(posA.x - posB.x) + Math.abs(posA.y - posB.y);

    let getIntersectionsInRow = (sensorsWithBeacons, targetRow = 10) => {
        // this might take way more memory than necessary, but let's start with it:
        let intersections = {};

        sensorsWithBeacons.forEach(sensorAndClosestBeacon => {
            let {sensor, beacon} = sensorAndClosestBeacon;
            let mDistToBeacon = getManhattanDistance(sensor, beacon);
            let mDistToRow = getManhattanDistance(sensor, {x: sensor.x, y: targetRow });

            if (mDistToRow > mDistToBeacon) {
                return;
            }

            // ok, now we need the outer bounds we can reach on the targetRow
            let leftoverDistance = mDistToBeacon - mDistToRow;
            let start = sensor.x - leftoverDistance;
            let end = sensor.x + leftoverDistance;
            rangeToArray(start, end).forEach(x => intersections[x] = true);
        });

        sensorsWithBeacons.forEach(sensorAndClosestBeacon => {
            let {sensor, beacon} = sensorAndClosestBeacon;
            if (beacon.y === targetRow && intersections[beacon.x]) {
                delete intersections[beacon.x];
            }
        });

        return intersections;
    };

    let getIntersectionRanges = (sensorsWithBeacons, targetRow) => {
        assert(targetRow !== undefined);
        let intersectionRanges = [];

        sensorsWithBeacons.forEach(sensorAndClosestBeacon => {
            let {sensor, beacon} = sensorAndClosestBeacon;
            let mDistToBeacon = getManhattanDistance(sensor, beacon);
            let mDistToRow = getManhattanDistance(sensor, {x: sensor.x, y: targetRow });

            if (mDistToRow > mDistToBeacon) {
                return;
            }

            // ok, now we need the outer bounds we can reach on the targetRow
            let leftoverDistance = mDistToBeacon - mDistToRow;
            let start = sensor.x - leftoverDistance;
            let end = sensor.x + leftoverDistance;
            intersectionRanges.push({ start, end });
        });

        return intersectionRanges;
    }

    let rangesOverlap = (rangeA, rangeB) => !(rangeA.start > rangeB.end || rangeB.start > rangeA.end);
    let rangeIsContained = (testRange, containingRange) => {
        return testRange.start >= containingRange.start && testRange.end <= containingRange.end;
    };

    let getNonOverlappingRanges = (testRange, overlapRange) => {
        if (!rangesOverlap(testRange, overlapRange)) {
            return [testRange];
        }

        if (rangeIsContained(testRange, overlapRange)) {
            return [];
        }

        if (rangeIsContained(overlapRange, testRange)) {
            return [
                { start: testRange.start, end: overlapRange.start - 1},
                { start: overlapRange.end + 1, end: testRange.end },
            ].filter(el => el.start <= el.end);
        };

        if (testRange.start < overlapRange.start) {
            return [{ start: testRange.start, end: overlapRange.start - 1}];
        }

        return [{start: overlapRange.end + 1, end: testRange.end }];
    };

    let getHiddenBeaconInContainedSpace = (sensorsWithBeacons, xyMin = 0, xyMax = 20) => {
        // there's no way to solve this by iterating all the enclosed points, 4M * 4M is absurd
        // but maybe we could iterate just 4M (ie: all the rows)
        // it's still quite slow, but it finishes in 5 or so seconds

        for (let row = xyMin; row <= xyMax; row++) {
            let intersectionRanges = getIntersectionRanges(sensorsWithBeacons, row);

            let remainders = [{start: xyMin, end: xyMax}];

            intersectionRanges.forEach(subtractRange => {
                remainders = remainders.map(r => getNonOverlappingRanges(r, subtractRange)).flat();
            });

            if (remainders.length) {
                assert(remainders.length === 1);
                assert(remainders[0].start === remainders[0].end);
                return {x: remainders[0].start, y: row };
            }
        }

        assert(false, 'uh oh');
    };

    let part2 = (rawInput) => {
        let sensorsWithBeacons = getSensorsWithBeacons(rawInput);
        let beacon = getHiddenBeaconInContainedSpace(sensorsWithBeacons, 0, 4 * 1000 * 1000);
        return beacon.x * (4 * 1000 * 1000) + beacon.y;
    };

    let part1 = (rawInput) => {
        let sensorsWithBeacons = getSensorsWithBeacons(rawInput);
        return Object.keys(getIntersectionsInRow(sensorsWithBeacons, 2000000)).length;
    };

    return [part1, part2];
})();
