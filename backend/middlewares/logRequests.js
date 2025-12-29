export default function logRequests(req, res, next) {
  try {
    console.log(`[REQ] ${req.method} ${req.originalUrl}`);
    // Log a subset of headers for readability
    const { host, origin, referer, cookie, authorization } = req.headers;
    console.log("Headers:", { host, origin, referer, authorization });
    // Log cookies (may be an empty object)
    console.log("Cookies:", req.cookies);
  } catch (err) {
    console.error("logRequests error:", err);
  }
  next();
}
