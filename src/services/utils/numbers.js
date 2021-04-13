export default {
    isNumeric(value) {
        return /^-?\d+$/.test(value);
    },
    isNumber(evt) {
        let value =  evt.target.value;
        if (this.isNumeric(evt.key)) {
            value += parseInt(evt.key)
        }
        let checkDot = value
            && value.search(/\./) === -1;
        if (/^[0-9]*[.,]?[0-9]*$/.test(evt.key)
            && ((evt.key === '.' && value) ? checkDot : true)) {
            return true;
        } else {
            evt.preventDefault();
        }
    },
};

