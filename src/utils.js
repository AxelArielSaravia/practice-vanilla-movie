/**
@type {(max: number) => number}*/
function random(max) {
    return Math.floor(Math.random() * max);
};


export {
    random
};
