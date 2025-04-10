import axios from "axios";

const baseURL = "gfexs42Destination/sap/opu/odata/sap/YESB_GFEX";
const baseURLSUPPLIER = "gfexs42Destination/sap/opu/odata/sap/YAPI_GFEX_SUPPLIER_O2";


const userApi = "/user-api/currentUser";

const instance = axios.create({
  baseURL
});

export const getSupplier = async (params = { $top: 100, $skip: 0 }) => {
  const { data } = await instance.get("/CentralConsumer", {
    params
  });

  return data.d?.results || data.d || data.value;
};
export const getManufacturer = async (params = { $top: 100, $skip: 0 }) => {
  const { data } = await instance.get("/ManufacturerMaterial", {
    params
  });

  return data.d?.results || data.d || data.value;
};

export const getClass = async (params = { $top: 1000, $skip: 0 }) => {
  const { data } = await instance.get("/MaterialClass", {
    params
  });

  return data.d?.results || data.d || data.value;
};

export const getTableCount = async () => {
  const { data } = await instance.get("/CentralConsumer/$count");
  return data;
};

export const getUserLogged = async () => {
 
  const { data } = await axios.get(userApi);
  return data.d?.results || data.d || data.value;
};

const fetchXCSRFToken = async () => {
  try {
    const response = await axios.get(`${baseURLSUPPLIER}/?sap-client=220`, {
      headers: {
        'X-CSRF-Token': 'Fetch'
      }
    });
    return response.headers['x-csrf-token'];
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}

export const postSupplier= async (oEntry) => {

  const csrfToken = await fetchXCSRFToken();

  if (!csrfToken) {
    console.error('Failed to retrieve CSRF token.');
    return;
  }

  try {
    const response = await axios.post(`${baseURLSUPPLIER}/SuppliersGFEX?sap-client=220`, {
      ...oEntry
    }, {
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      }
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}

export const postExclusivityLetter = async (oEntry) => {

  const csrfToken = await fetchXCSRFToken();

  if (!csrfToken) {
    console.error('Failed to retrieve CSRF token.');
    return;
  }

  try {
    const response = await axios.post(`${baseURLSUPPLIER}/ExclusiveCardGFEX?sap-client=220`, {
      ...oEntry
    }, {
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      }
    });
    console.log('OData request successful:', response.data);
  } catch (error) {
    console.error('Error making OData request:', error);
  }
}
