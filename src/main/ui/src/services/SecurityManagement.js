import authentication from "./Authentication";
import authenticationHeader from "./AuthenticationHeader";

class SecurityManagement {
  #roleCollectionUrl = "/api/security/admin/roles";
  #roleUrl = "/api/security/admin/role";
  #userCollectionUrl = "/api/security/admin/users";
  #userUrl = "/api/security/admin/user";

  async getRoles() {
    return fetch(this.#roleCollectionUrl, {
      method: "GET",
      headers: authenticationHeader.completeHeaders(),
    })
      .then((res) => {
        return this.#processResponse(res);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  async createRole(rolename) {
    var role = {};
    role.name = rolename;
    return fetch(this.#roleUrl, {
      method: "POST",
      headers: this.#getRequestHeaders(),
      body: JSON.stringify(role),
    })
      .then((res) => {
        return this.#processResponse(res);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  async deleteRole(rolename) {
    var role = {};
    role.name = rolename;
    return fetch(this.#roleUrl + "/" + rolename, {
      method: "DELETE",
      headers: this.#getRequestHeaders(),
    })
      .then((res) => {
        return this.#processResponse(res);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  async getUsers() {
    return fetch(this.#userCollectionUrl, {
      method: "GET",
      headers: authenticationHeader.completeHeaders(),
    })
      .then((res) => {
        return this.#processResponse(res);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  async createUser(user) {
    return fetch(this.#userUrl, {
      method: "POST",
      headers: this.#getRequestHeaders(),
      body: JSON.stringify(user),
    })
      .then((res) => {
        return this.#processResponse(res);
      })
      .catch((error) => {
        throw error;
      });
  }

  async deleteUser(username) {
    return fetch(this.#userUrl + "/" + username, {
      method: "DELETE",
      headers: this.#getRequestHeaders(),
    })
      .then((res) => {
        return this.#processResponse(res);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  async modifyUser(user) {
    return fetch(this.#userUrl + "/" + user.username, {
      method: "PUT",
      headers: this.#getRequestHeaders(),
      body: JSON.stringify(user),
    })
      .then((res) => {
        return this.#processResponse(res);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  #getRequestHeaders() {
    var reqHeaders = new Headers();
    reqHeaders.append("Content-Type", "application/json");
    return authenticationHeader.augmentHeaders(reqHeaders);
  }

  async #processResponse(response) {
    if (!response.ok) {
      const error = new Error("HTTP Error");
      error.status = response.status;
      console.log("HTTP error returned");
      throw error;
    }
    return response.text().then((text) => {
      try {
        response = JSON.parse(text);
        try {
          authentication.refreshToken();
        } catch {}
        return response;
      } catch {
        const error = new Error("Not JSON content");
        console.log("Non JSON content returned");
        throw error;
      }
    });
  }
}

const securityManagement = new SecurityManagement();
export default securityManagement;
