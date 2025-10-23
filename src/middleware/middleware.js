import { rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

export const checkApiKey = (request, response, next) => {
  const key = request.header("x-api-key");

  if (key && key === process.env.API_KEY) {
    // continue
    next();
  } else {
    // send a access denied response
    console.log("Missing api key");

    response.status(403).json({ error: "Access denied. Need API Key" });
  }
};

export const logging = (request, response, next) => {
  console.log(
    `${request.method} ${request.url} at ${new Date().toISOString()}`
  );
  next();
};

export const notFoundError = (request, response, next) => {
  response.status(404).json({
    error: "We could not find the url you are looking for",
    message: `route ${request.originalUrl} not found`,
  });
};

export const generalError = (error, request, response, next) => {
  console.log("ERROR! Something broke", error.stack);

  response.status(500).json({
    error: error.name,
    message: error.message,
  });
};

// middleware to authenticate users
export const authenticate = (request, response, next) => {
  const authHeader = request.headers.authorization;

  const token = authHeader.split(" ")[1];

  // verify a token symmetric
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err)
      response.status(401).json({ error: "invalid credentials. JWT missing" });

    // add user information from JWT
    request.user = decoded; // create user property in request object

    next();
  });
};
