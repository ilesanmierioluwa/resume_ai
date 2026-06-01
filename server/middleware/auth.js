import jwt from 'jsonwebtoken';

/**
 * Verifies the JWT bearer token and attaches the authenticated user id to the request.
 *
 * @param {import('express').Request} req - Incoming request object.
 * @param {import('express').Response} res - Outgoing response object.
 * @param {import('express').NextFunction} next - Express next middleware callback.
 * @returns {void}
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, name: decoded.name };
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}

