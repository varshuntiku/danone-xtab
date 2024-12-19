export function getRoute(url) {
  var is_admin = window.location.href.indexOf('admin') !== -1;

  if (is_admin) {
    return "/admin/" + url;
  } else {
    return "/" + url;
  }
}