import authenticationHeader from "./AuthenticationHeader";

const authenticationAPI = "/api/security/public/login";
const refreshTokenAPI = "/api/security/secure/token";
const changePasswordAPI = "api/security/secure/changepassword";
const key = "user";

class Authentication {
  #userChangeHandler;

  async login(username, password) {
    return fetch(authenticationAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((res) => {
        if (!res.ok) {
          const error = new Error("HTTP Error");
          error.status = res.status;
          if (res.status === 401) {
            this.logout();
          }
          console.log("HTTP error returned");
          throw error;
        }
        return res;
      })
      .then((res) => res.text())
      .then((text) => {
        try {
          return JSON.parse(text);
        } catch {
          const error = new Error("Not JSON content");
          console.log("Non JSON content returned");
          throw error;
        }
      })
      .then((data) => {
        if (data.accessToken) {
          if (this.#userChangeHandler) {
            this.#userChangeHandler(JSON.stringify(data));
          }
          localStorage.setItem(key, JSON.stringify(data));
          window.dispatchEvent(new StorageEvent("local-storage", { key }));
        }
        return data;
      });
  }
  async changePassword(password, newPassword) {
    var reqHeaders = new Headers();
    reqHeaders.append("Content-Type", "application/json");
    reqHeaders = authenticationHeader.augmentHeaders(reqHeaders);
    return fetch(changePasswordAPI, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({ password: password, newPassword: newPassword }),
    })
      .then((res) => {
        if (!res.ok) {
          const error = new Error("HTTP Error");
          error.status = res.status;
          console.log("HTTP error returned");
          throw error;
        }
        return res;
      })
      .then((res) => res.text())
      .then((text) => {
        try {
          return JSON.parse(text);
        } catch {
          const error = new Error("Not JSON content");
          console.log("Non JSON content returned");
          throw error;
        }
      });
  }

  async refreshToken() {
    return fetch(refreshTokenAPI, {
      headers: authenticationHeader.completeHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          const error = new Error("HTTP Error");
          error.status = res.status;
          if (res.status === 401) {
            this.logout();
          }
          console.log("HTTP error returned");
          throw error;
        }
        return res;
      })
      .then((res) => res.text())
      .then((text) => {
        try {
          return JSON.parse(text);
        } catch {
          const error = new Error("Not JSON content");
          console.log("Non JSON content returned");
          throw error;
        }
      })
      .then((data) => {
        if (data.accessToken) {
          localStorage.setItem(key, JSON.stringify(data));
        }
        return data;
      });
  }

  logout() {
    localStorage.removeItem(key);
    if (this.#userChangeHandler) {
      this.#userChangeHandler(null);
    }
    window.dispatchEvent(new StorageEvent("local-storage", { key }));
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(key));
  }

  subscribeUserChanges(callback) {
    if (typeof(callback) !== "function") {
      throw new Error("Invalid callback function");
    }
    this.#userChangeHandler = callback;
    return JSON.parse(localStorage.getItem(key));
  }

  getLocalStorageKey() {
    return key;
  }
}
const authentication = new Authentication();
export default authentication;
