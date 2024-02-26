import axios from "axios";
const { middleWareApiUrl } = require("../constants");
const serviceName = "users";
const tableNameSingular = "user";
const tableNamePlural = "users";

export async function insertRecord(body) {
  try {
    const url = `http://localhost:8080/api/users`;
    const response = await axios.post(url, body, {
      auth: {
        username: process.env.MIDDLEWARE_API_USERNAME,
        password: process.env.MIDDLEWARE_API_PASSWORD,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to insert ${tableNameSingular}`);
  }
}

export async function updateRecord(id, body) {
  try {
    const url = `http://localhost:8080/api/users/${id}`;
    const response = await axios.put(url, body, {
      auth: {
        username: process.env.MIDDLEWARE_API_USERNAME,
        password: process.env.MIDDLEWARE_API_PASSWORD,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to update ${tableNameSingular}`);
  }
}

export async function getRecordByKey(id) {
  try {
    const url = `http://localhost:8080/api/users`;
    const response = await axios.get(url, {
      auth: {
        username: process.env.MIDDLEWARE_API_USERNAME,
        password: process.env.MIDDLEWARE_API_PASSWORD,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to get ${tableNameSingular}`);
  }
}

export async function getAllRecords() {
  try {
    // const url = `${middleWareApiUrl}/api/${serviceName}`;
    const url = `http://localhost:8080/api/users`;

    const response = await axios.get(url, {
      auth: {
        username: process.env.MIDDLEWARE_API_USERNAME,
        password: process.env.MIDDLEWARE_API_PASSWORD,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to get ${tableNamePlural}`);
  }
}

export async function deleteRecordByKey(id) {
  try {
    const url = `http://localhost:8080/api/users/${id}`;
    const response = await axios.delete(url, {
      auth: {
        username: process.env.MIDDLEWARE_API_USERNAME,
        password: process.env.MIDDLEWARE_API_PASSWORD,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to delete ${tableNameSingular}`);
  }
}

export async function deleteAllRecords() {
  try {
    const url = `http://localhost:8080/api/users`;
    const response = await axios.delete(url, {
      auth: {
        username: process.env.MIDDLEWARE_API_USERNAME,
        password: process.env.MIDDLEWARE_API_PASSWORD,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to delete all ${tableNamePlural}`);
  }
}

export async function getLimitedRecords(page = 1, limit = 5) {
  try {
    const url = `http://localhost:8080/api/users/limit`;
    const params = new URLSearchParams({ page, limit }).toString();
    const response = await axios.get(`${url}?${params}`, {
      auth: {
        username: process.env.MIDDLEWARE_API_USERNAME,
        password: process.env.MIDDLEWARE_API_PASSWORD,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to get limited records of ${tableNamePlural}`);
  }
}

// export async function getLimitedRecords(page = 1, limit = 5) {
//   try {
//     const url = `http://localhost:8080/api/users/limit?page=1&limit=5`;
//     // const url = `http://localhost:8080/api/users/limit?page=1&limit=5`;
//     const params = new URLSearchParams({ page, limit }).toString();
//     const response = await axios.get(`${url}${params}`, {
//       auth: {
//         username: process.env.MIDDLEWARE_API_USERNAME,
//         password: process.env.MIDDLEWARE_API_PASSWORD,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw new Error(`Failed to get limited records of ${tableNamePlural}`);
//   }
// }