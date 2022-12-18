var day18 = (() => {

    let getCubePositions = (rawInput) => {
        return rawInput.split(/\n/).filter(el => el).map(el => {
            let [x, y, z] = el.split(',').map(num => parseInt(num, 10));
            return {x, y, z};
        });
    };

    let getCubeKey = (cube) => `${cube.x},${cube.y},${cube.z}`;

    let canCubePositionReachExternal = (cubePosition, cubePositionsByKey, minMaxMap) => {
        // let's do a BFS until we either run out of stuff or escape min/max bounds
        let {xMin, xMax, yMin, yMax, zMin, zMax} = minMaxMap;

        let queue = [cubePosition];
        let visited = {};

        while (queue.length) {
            let currentAirPocketCube = queue.shift();

            if (
                currentAirPocketCube.x > xMax || currentAirPocketCube.x < xMin ||
                currentAirPocketCube.y > yMax || currentAirPocketCube.y < yMin ||
                currentAirPocketCube.z > zMax || currentAirPocketCube.z < zMin
            ) {
                // we escaped the droplet, we found sweet freedom in the lake
                return true;
            }

            visited[getCubeKey(currentAirPocketCube)] = true;

            let neighbors = [
                {...currentAirPocketCube, x: currentAirPocketCube.x + 1},
                {...currentAirPocketCube, x: currentAirPocketCube.x - 1},
                {...currentAirPocketCube, y: currentAirPocketCube.y + 1},
                {...currentAirPocketCube, y: currentAirPocketCube.y - 1},
                {...currentAirPocketCube, z: currentAirPocketCube.z + 1},
                {...currentAirPocketCube, z: currentAirPocketCube.z - 1},
            ].filter(neighborCube => {
                if (visited[getCubeKey(neighborCube)]) {
                    return false;
                }

                if (cubePositionsByKey[getCubeKey(neighborCube)]) {
                    return false;
                }

                visited[getCubeKey(neighborCube)] = true;
                return true;
            });

            queue.push(...neighbors);
        }

        return false;
    };

    let countExternalCubeFaces = (rawInput) => {
        // this one takes awhile to complete on the actual input, like 5-10 seconds
        // oh well
        let cubePositions = getCubePositions(rawInput);
        let cubePositionsByKey = {};
        cubePositions.map(c => {
            cubePositionsByKey[getCubeKey(c)] = c;
        });

        let xMin = Math.min(...cubePositions.map(c => c.x));
        let xMax = Math.max(...cubePositions.map(c => c.x));

        let yMin = Math.min(...cubePositions.map(c => c.y));
        let yMax = Math.max(...cubePositions.map(c => c.y));

        let zMin = Math.min(...cubePositions.map(c => c.z));
        let zMax = Math.max(...cubePositions.map(c => c.z));

        let minMaxMap = {xMin, xMax, yMin, yMax, zMin, zMax};

        return cubePositions.map((cube, index) => {
            // still the same as part 1, but with a twist
            let result = 0;
            if (!cubePositionsByKey[getCubeKey({...cube, x: cube.x + 1})]) {
                result = canCubePositionReachExternal(
                    {...cube, x: cube.x + 1},
                    cubePositionsByKey,
                    minMaxMap
                ) ? result + 1 : result;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, x: cube.x - 1})]) {
                result = canCubePositionReachExternal(
                    {...cube, x: cube.x - 1},
                    cubePositionsByKey,
                    minMaxMap
                ) ? result + 1 : result;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, y: cube.y + 1})]) {
                result = canCubePositionReachExternal(
                    {...cube, y: cube.y + 1},
                    cubePositionsByKey,
                    minMaxMap
                ) ? result + 1 : result;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, y: cube.y - 1})]) {
                result = canCubePositionReachExternal(
                    {...cube, y: cube.y - 1},
                    cubePositionsByKey,
                    minMaxMap
                ) ? result + 1 : result;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, z: cube.z - 1})]) {
                result = canCubePositionReachExternal(
                    {...cube, z: cube.z - 1},
                    cubePositionsByKey,
                    minMaxMap
                ) ? result + 1 : result;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, z: cube.z + 1})]) {
                result = canCubePositionReachExternal(
                    {...cube, z: cube.z + 1},
                    cubePositionsByKey,
                    minMaxMap
                ) ? result + 1 : result;
            }
            return result;
        }).reduce((a, e) => a + e, 0);
    };

    let countExposedCubeFaces = (rawInput) => {
        let cubePositions = getCubePositions(rawInput);
        let cubePositionsByKey = {};
        cubePositions.map(c => {
            cubePositionsByKey[getCubeKey(c)] = c;
        });

        return cubePositions.map(cube => {
            // we have to check x + 1, x - 1, y + 1, y - 1, z + 1, z - 1
            let result = 0;
            if (!cubePositionsByKey[getCubeKey({...cube, x: cube.x + 1})]) {
                result += 1;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, x: cube.x - 1})]) {
                result += 1;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, y: cube.y - 1})]) {
                result += 1;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, y: cube.y + 1})]) {
                result += 1;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, z: cube.z + 1})]) {
                result += 1;
            }
            if (!cubePositionsByKey[getCubeKey({...cube, z: cube.z - 1})]) {
                result += 1;
            }
            return result;
        }).reduce((a, e) => a + e, 0);
    };

    return [countExposedCubeFaces, countExternalCubeFaces];
})();
