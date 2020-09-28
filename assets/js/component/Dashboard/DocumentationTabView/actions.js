import axios from 'axios';

export function fetchDocumentation()
{
  return axios.get(
    '/wp-json/utubevideogallery/v1/documentation',
    {
      headers: {'X-WP-Nonce': utvJSData.restNonce}
    }
  );
}

export default {
  fetchDocumentation
}
