/**
 *
 * @param errorMessage
 * @return {string|*}
 */
export default function parseError(errorMessage = '') {
    const i = errorMessage.indexOf('(') > -1 ? errorMessage.indexOf('(') : errorMessage.length;
    let startI = errorMessage.indexOf('error='), endI = errorMessage.indexOf(', method');
    if(i > -1 || startI > -1 || endI > -1) {
        let errorTemp = errorMessage.substring(startI + 6, endI);
        if (errorTemp) {
            try {
                return (JSON.parse(errorTemp)).message;
            } catch (e) {
                return errorMessage.substring(0, i);
            }
        }
        return errorMessage.substring(0, i);
    } else {
        return errorMessage;
    }
}
