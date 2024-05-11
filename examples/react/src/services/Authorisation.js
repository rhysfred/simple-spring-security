import Authentication from "./Authentication";

class Authorisation {
  hasRole(role) {
    var user = Authentication.getCurrentUser();
    if (user) {
      var roles = user.roles;
      for (var i = 0; i < roles.length; i++) {
        if (role === roles[i]) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  hasOneOfRoles(probeRoles) {
    var user = Authentication.getCurrentUser();
    if (user) {
      var roles = user.roles;
      for (var i = 0; i < roles.length; i++) {
        for (var j = 0; j < probeRoles.length; j++) {
          if (probeRoles[j] === roles[i]) {
            return true;
          }
        }
      }
      return false;
    }
    return false;
  }
}
const authorisation = new Authorisation();
export default authorisation;
