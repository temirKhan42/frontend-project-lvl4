import axios from 'axios';
import routes from '../routes.js';

const fetchData = async (token) => {
  try {
    const response = await axios({
      method: 'get',
      url: routes.dataPath(),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (err) {
    console.log('Failed initial Request in "getInitialData.js"');
  }
};

export default fetchData;
