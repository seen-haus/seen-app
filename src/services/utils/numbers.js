export default {
    isNumeric(value) {
        return /^-?\d+$/.test(value);
    },
    isNumber(evt) {
        let value = evt.target.value;
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
    isInteger(evt) {
        let value = evt.target.value;
        if (this.isNumeric(evt.key)) {
            value += parseInt(evt.key)
        }
        if (/^[0-9]*$/.test(evt.key)
            && evt.key !== '.') {
            return true;
        } else {
            evt.preventDefault();
        }
    },
    countDecimals(value) {
        if (Math.floor(value) !== value)
            return value.toString().split(".")[1].length || 0;
        return 0;
    },
    removeDecimals(value, num = 3) {
        let decimalCount = this.countDecimals(value);
        if (decimalCount > 15) {
            return value.toString().slice(0, -(decimalCount - (15)));
        } else {
            return
        }
    }
};

