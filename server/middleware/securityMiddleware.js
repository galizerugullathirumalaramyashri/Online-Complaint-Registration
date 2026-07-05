const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 300;
const buckets = new Map();

function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
  next();
}

function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const bucket = buckets.get(key) || { count: 0, resetAt: now + WINDOW_MS };

  if (bucket.resetAt < now) {
    bucket.count = 0;
    bucket.resetAt = now + WINDOW_MS;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > MAX_REQUESTS) {
    return res.status(429).json({ message: "Too many requests. Please try again later." });
  }

  next();
}

function preventNoSqlInjection(req, res, next) {
  sanitize(req.body);
  sanitize(req.params);
  sanitize(req.query);
  next();
}

function sanitize(value) {
  if (!value || typeof value !== "object") return;

  Object.keys(value).forEach((key) => {
    if (key.startsWith("$") || key.includes(".")) {
      delete value[key];
      return;
    }
    sanitize(value[key]);
  });
}

module.exports = { securityHeaders, rateLimit, preventNoSqlInjection };