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
      .then((user) => {
        if (user.accessToken) {
          localStorage.setItem(key, JSON.stringify(user));
          if (this.#userChangeHandler) {
            this.#userChangeHandler(JSON.stringify(user));
          }
          window.dispatchEvent(new StorageEvent("local-storage", { key: key, newValue: user }));
        }
        return user;
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
      .then((user) => {
        if (user.accessToken) {
          localStorage.setItem(key, JSON.stringify(user));

        }
        return user;
      });
  }

  logout() {
    localStorage.removeItem(key);
    if (this.#userChangeHandler) {
      this.#userChangeHandler(null);
    }
    window.dispatchEvent(new StorageEvent("local-storage", { key: key, newValue: user }));
  }

  getCurrentUser() {
    const user = localStorage.getItem(key);
    if (!user) return null;
    return JSON.parse(user);
  }

  subscribeUserChanges(callback) {
    if (typeof(callback) !== "function") {
      throw new Error("Invalid callback function");
    }
    this.#userChangeHandler = callback;
    const user = localStorage.getItem(key);
    if (!user) return null;
    return JSON.parse(user);
  }

  getLocalStorageKey() {
    return key;
  }
}
const authentication = new Authentication();
export default authentication;
