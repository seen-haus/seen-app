/**
 *
 * @param errorMessage
 * @return {string|*}
 */
export default function parseError(errorMessage = '') {
    const i = errorMessage.indexOf('(');
    let startI = errorMessage.indexOf('error='), endI = errorMessage.indexOf(', method');
    let errorTemp = errorMessage.substring(startI + 6, endI);
    if (errorTemp) {
        try {
            return (JSON.parse(errorTemp)).message;
        } catch (e) {
            return errorMessage.substring(0, i);
        }
    }
    return errorMessage.substring(0, i);
}
