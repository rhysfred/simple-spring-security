import authentication from "../services/Authentication";
import authenticationHeader from "../services/AuthenticationHeader";

export async function postJson(url, object) {
  var reqHeaders = new Headers();
  reqHeaders.append("Content-Type", "application/json");
  reqHeaders = authenticationHeader.augmentHeaders(reqHeaders);
  const response = await fetch(url, {
    method: "POST",
    headers: reqHeaders,
    body: JSON.stringify(object),
  });
  return checkResponse(response);
}

export async function deleteJson(url, id, subScope) {
  var targetUrl = `${url}/${id}` + (subScope ? `/${subScope}` : "");
  var reqHeaders = new Headers();
  reqHeaders.append("Content-Type", "application/json");
  reqHeaders = authenticationHeader.augmentHeaders(reqHeaders);
  const response = await fetch(targetUrl, {
    method: "DELETE",
    headers: reqHeaders,
  });
  return checkResponse(response);
}

export async function putJson(url, id, object, subScope) {
  var targetUrl = `${url}/${id}` + (subScope ? `/${subScope}` : "");
  var reqHeaders = new Headers();
  reqHeaders.append("Content-Type", "application/json");
  reqHeaders = authenticationHeader.augmentHeaders(reqHeaders);
  const response = await fetch(targetUrl, {
    method: "PUT",
    headers: reqHeaders,
    body: JSON.stringify(object),
  });
  return checkResponse(response);
}

function checkResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      authentication.logout();
    }
    const error = new Error("HTTP Error");
    error.status = response.status;
    throw error;
  }
  authentication.refreshToken();
  return response;
}
