export function redirect(path, res) {
  if (res) {
    res.writeHead(301, { Location: path });
    res.end();
  }
}
