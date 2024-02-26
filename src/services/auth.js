import { useLocation } from "react-router-dom";
import { decodeJWTString } from "../util";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import jwtDecode from "jwt-decode";
import { CognitoIdentityServiceProvider } from "aws-sdk";
const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const poolData = {
  UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_AWS_COGNITO_APP_CLIENT_ID,
};
const userPool = new CognitoUserPool(poolData);

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.REACT_APP_AWS_REGION,
});

export const checkLoginStatus = () => {
  const cognito_id_token = localStorage.getItem("COGNITO_ID_TOKEN"); // Or get it from cookies

  if (cognito_id_token === null) {
    return false;
  }

  let userDetails = decodeJWTString(cognito_id_token);
  if (userDetails.username === null) {
    return false;
  } else {
    if (isAccessTokenExpired(cognito_id_token)) {
      return false;
    } else {
      return true;
    }
  }
};

export const isLoggedIn = () => {
  const location = useLocation();
  if (
    location.pathname === "/login" ||
    location.pathname === "/change-password"
  ) {
    return false;
  }
  if (checkLoginStatus()) {
    return true;
  }
};

export function getLoginUserInfo() {
  const cognito_id_token = localStorage.getItem("COGNITO_ID_TOKEN");
  if (cognito_id_token === null) {
    return {};
  }

  let userDetails = decodeJWTString(cognito_id_token);

  let userInfo = {
    email_id: userDetails.email,
    name: userDetails.name,
    account_no: userDetails.customAttributes.account_no,
    phone: userDetails.customAttributes.phone,
    role: userDetails.customAttributes.role,
  };

  return userInfo;
}

export async function createCognitoUser(
  email,
  password,
  name,
  phone_number,
  phone_prefix,
  account_no,
  role
) {
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    Username: email,
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "family_name",
        Value: account_no,
      },
      {
        Name: "name",
        Value: name,
      },
      {
        Name: "custom:account_no",
        Value: account_no,
      },
      {
        Name: "custom:role",
        Value: role,
      },
      {
        Name: "custom:phone",
        Value: phone_number,
      },
      {
        Name: "custom:phone_prefix",
        Value: phone_prefix,
      },
    ],
  };

  try {
    const data = await cognito.adminCreateUser(params).promise();

    data.status = "success";
    return data;
  } catch (err) {
    let data = {};
    data.status = "error";
    data.message = err.message;
    return data;
  }
}

export async function getUserByEmail(email) {
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    Username: email,
  };
  try {
    const data = await cognito.adminGetUser(params).promise();

    // Do something with the user data
    return data;
  } catch (err) {
    return null;
    // Handle the error
  }
}

export async function authenticateUser(username, password) {
  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  const userData = {
    Username: username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

export async function resetTemporaryPassword(username, newPassword) {
  const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    Username: username, // Replace with the username of the user whose password is being reset
    Password: newPassword, // The new password you want to set for the user
    Permanent: true, // Set to true to make the password permanent (not temporary)
  };

  try {
    let data = await cognitoIdentityServiceProvider
      .adminSetUserPassword(params)
      .promise();

    data.status = "success";
    return data;
  } catch (err) {
    let data = {};
    data.status = "error";
    data.message = err.message;
    return data;
  }
}

export function isAccessTokenExpired(accessToken) {
  const decodedToken = jwtDecode(accessToken);
  const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
  const currentTime = Date.now();
  return expirationTime < currentTime;
}

export function logoutCurrentUser() {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    cognitoUser.getSession((err, session) => {
      if (err) {
      } else if (!session.isValid()) {
      } else {
        cognitoUser.globalSignOut({
          onSuccess: () => {},
          onFailure: (err) => {},
        });
      }
    });
  } else {
  }
}

export function verifyEmail(email) {
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    Username: email,
    UserAttributes: [
      {
        Name: "email_verified",
        Value: "true",
      },
    ],
  };

  const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminUpdateUserAttributes(
      params,
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

export function sendResetCode(email) {
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: () => {
        resolve("Password reset initiated");
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

export function resetPassword(email, code, newPassword) {
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        resolve("Password reset successful");
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

export async function getAllUsers() {
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  };

  try {
    const data = await cognito.listUsers(params).promise();

    const users = data.Users.map((user) => {
      return {
        username: user.Username,
        email_id: user.Attributes.find((attr) => attr.Name === "email").Value,
        name: user.Attributes.find((attr) => attr.Name === "name").Value,
        account_no: user.Attributes.find(
          (attr) => attr.Name === "custom:account_no"
        ).Value,
        phone: user.Attributes.find((attr) => attr.Name === "custom:phone")
          .Value,
        phone_prefix: user.Attributes.find(
          (attr) => attr.Name === "custom:phone_prefix"
        ).Value,
        role: user.Attributes.find((attr) => attr.Name === "custom:role").Value,
        status: user.Enabled,
      };
    });

    return users;
  } catch (err) {
    // Handle error
  }
}

export async function getAllUsersByRequestId(account_no) {
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    Filter: `family_name	 = "${account_no}"`, // Add Filter parameter
  };

  try {
    const data = await cognito.listUsers(params).promise();

    const users = data.Users.map((user) => {
      return {
        username: user.Username,
        email_id: user.Attributes.find((attr) => attr.Name === "email").Value,
        name: user.Attributes.find((attr) => attr.Name === "name").Value,
        account_no: user.Attributes.find(
          (attr) => attr.Name === "custom:account_no"
        ).Value,
        phone: user.Attributes.find((attr) => attr.Name === "custom:phone")
          .Value,
        phone_prefix: user.Attributes.find(
          (attr) => attr.Name === "custom:phone_prefix"
        ).Value,
        role: user.Attributes.find((attr) => attr.Name === "custom:role").Value,
        status: user.Enabled,
      };
    });

    return users;
  } catch (err) {
    // Handle error
  }
}

export function updateCognitoUser(user) {
  if (user.status) {
    enableUser(user.email_id);
  } else {
    disableUser(user.email_id);
  }
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    Username: user.email_id,

    UserAttributes: [
      {
        Name: "name",
        Value: user.name,
      },
      {
        Name: "custom:phone",
        Value: user.phone,
      },
      {
        Name: "custom:phone_prefix",
        Value: user.phone_prefix,
      },
      {
        Name: "custom:role",
        Value: user.role,
      },
    ],
  };

  const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.adminUpdateUserAttributes(
      params,
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

export const getUserCountByRequestId = async (account_no) => {
  try {
    account_no;
    const params = {
      UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
      AttributesToGet: [],
      Filter: `family_name = "${account_no}"`,
    };
    const result = await cognito.listUsers(params).promise();
    return result.Users.length;
  } catch (error) {
    return 0;
  }
};

export const getUserCount = async () => {
  try {
    const params = {
      UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
      AttributesToGet: [],
    };
    const result = await cognito.listUsers(params).promise();
    return result.Users.length;
  } catch (error) {
    return 0;
  }
};

// Enable user
const enableUser = async (username) => {
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    Username: username,
  };

  try {
    await cognito.adminEnableUser(params).promise();
  } catch (err) {
    // Handle error
  }
};

// Disable user
const disableUser = async (username) => {
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    Username: username,
  };

  try {
    await cognito.adminDisableUser(params).promise();
  } catch (err) {
    // Handle error
  }
};

// Delete user
export const deleteUser = async (username) => {
  const params = {
    UserPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    Username: username,
  };

  try {
    const resp = await cognito.adminDeleteUser(params).promise();
  } catch (err) {
    // Handle error
    console.log(err);
  }
};
