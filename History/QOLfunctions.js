export function mostFrequentElement(arr) {
    let count = {}; // Stock all occurrences
    let maxFreq = 0;
    let mostFrequent = null;

    for (let item of arr) {
        count[item] = (count[item] || 0) + 1; // Increments the counter

        if (count[item] > maxFreq) { // Check if its the new most represented element
            maxFreq = count[item];
            mostFrequent = item;
        }
    }
    return mostFrequent;
}