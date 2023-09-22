/**
@type {(max: number) => number}*/
function random(max) {
    return Math.floor(Math.random() * max);
};

function randomPermutation(arr) {
    var n = arr.length;
    for (var i = 0; i < n - 1; i += 1) {
        var j = i + Math.floor(Math.random() * (n - i))
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

export {
    random,
    randomPermutation,
};
