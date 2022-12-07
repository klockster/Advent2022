var day1 = (() => {

    let example = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`;

    let getCalorieListsPerElf = (rawListStr) => {
        return rawListStr.split(/\n\n/)
            .map(a => a.split(/\n/).filter(el => el.match(/\d+/)).map(el => parseInt(el, 10)));
    };

    let highestCalories = (rawListStr) => {
        let calorieListPerElf = getCalorieListsPerElf(rawListStr);
        let sumCaloriesPerElf = calorieListPerElf.map(el => el.reduce((a, e) => a + e, 0));
        return Math.max(...sumCaloriesPerElf);
    };

    // let part1 = highestCalories;

    let topThreeTotalCalories = (rawListStr) => {
        let calorieListPerElf = getCalorieListsPerElf(rawListStr);
        let sumCaloriesPerElf = calorieListPerElf.map(el => el.reduce((a, e) => a + e, 0));

        let sortedCaloriesPerElf = sumCaloriesPerElf.sort(numericSortLowestToHighestComparator);

        return sortedCaloriesPerElf.reverse().slice(0, 3).reduce((a, e) => a + e, 0);
    };

    return [highestCalories, topThreeTotalCalories];
})();
