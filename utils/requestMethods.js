import axios from "axios";

export let cancelTokenSource;

export const publicRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || process.env.REACT_APP_DEV_URL,
});

publicRequest.interceptors.request.use(function (config) {
    // const token = localStorage.getItem('token');
const token = 'eyJhbGciOiJSUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIiwiUk9MRV9BUEkiXSwidXNlcm5hbWUiOiJkYXJrbyIsImlhdCI6MTcxNDc3MDg0NSwiZXhwIjoxNzE0Nzk5NjQ1fQ.M42QSaL1aD5L_NBdMRIjFe_rLRiF1Qsblsu0d0VQxr1GeDsK6rSdXndGPtFdrna4CeIFfDz8rpAfXLGurOAAO_gwGX4Wpp1tX5LtJnoa1Nfu9zf8aW0utLbkiFuzGPbLqyYWg0pbwkHvmtEfRKpZXNBjlZSyXU5JdlW8dSq1zRhRu00zS-_MOc16m-cJ1hlyKbYwfYdXF0U62bu_RNsBiXHT73o3y5OQRGrdJWrAZsFAyDOlUUxeCS3e0q9WnoIInl_y79Nk_yS2Nr0p2hnuBUpYI8Rb4AG2fFmtCfrcpknxKf4Jw4OESGtxz3eXcCjn7Myb-AqQ75bk6AvDsKLEqJeyGVPj4oncoAafFEAlVpb1QT7_d4LHVoTEKbZaJSHcccZQmCDv5q_W0mAEwvtoH5iQk7QbPh2vrB9xNNSdbRqJ3sacUTQspqQx-Ox59fFFjntmC1pxMUF_pI7rmncPeXze5xA3QhQKxU4kFFi37PS34aUH1Fr46jk4JZQ9DOi3za7xJ4bxLKuXh6dbkumzN2dLBMW3m3XHXyxughiT8fR0NqCOkcTRQQ1rhC6hLgtgrv8MzuzjVR-OeX8EkNFNfNLhIIdZfiQI7TInboWaATSzcOBZFICIoBFFY-djEYnu3Hb0nOeJ6tsbVOc2X-t-YQvvTAwac8yIiZMY2Pmf8eo'
    cancelTokenSource = axios.CancelToken.source();
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    config.cancelToken = cancelTokenSource.token;
    return config;
});

publicRequest.interceptors.response.use((response) => response, (error) => {
    if (error.toString().includes("403") || error.toString().includes("401")) {
        localStorage.clear();
        window.location.reload();
    }
});