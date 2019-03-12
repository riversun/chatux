/**
 * Returns true when app is running on mobile devices
 * @returns {boolean}
 */
export function isMobileDevice() {

    const userAgent = navigator.userAgent;

    if (userAgent.indexOf('iPhone') > 0 || userAgent.indexOf('iPod') > 0 || userAgent.indexOf('Android') > 0 && userAgent.indexOf('Mobile') > 0) {
        //is smartphone
        return true;
    } else if (userAgent.indexOf('iPad') > 0 || userAgent.indexOf('Android') > 0) {
        //is tablet
        return true;
    } else {
        //is pc
        return false;
    }
}