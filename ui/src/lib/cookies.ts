import Cookies from 'js-cookie';

export default Cookies.withAttributes({
    sameSite: 'Strict'
});
