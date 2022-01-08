
const STEP_TYPE = Object.freeze({
    INITIATION: 0,
    UPLOAD: 1,
    MINT: 2,
    LIST: 3,
    PUBLISH: 4,
    LIVE: 5,
});

const STEP_INDEX = Object.freeze(Object.fromEntries(Object.entries(STEP_TYPE).map(stepType => stepType.reverse())))

export { STEP_TYPE, STEP_INDEX }