import cookie from "cookie";

export function getToken(req) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  );
  return cookies.token;
}

export function saveToken(token) {
  document.cookie = cookie.serialize("token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false,
  });
}

export function deleteToken() {
  document.cookie = cookie.serialize("token", "", {
    path: "/",
    maxAge: -1,
    httpOnly: false,
  });
}
