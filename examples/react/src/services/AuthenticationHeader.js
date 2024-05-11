import Authentication from "./Authentication";

class AuthenticationHeaders {
  completeHeaders() {
    const user = Authentication.getCurrentUser();
    if (user && user.accessToken) {
      return { Authorization: "Bearer " + user.accessToken };
    } else {
      return {};
    }
  }
  augmentHeaders(headers) {
    const user = Authentication.getCurrentUser();
    headers.set("Authorization", "Bearer " + user.accessToken);
    return headers;
  }
}
const authenticationHeaders = new AuthenticationHeaders();
export default authenticationHeaders;
