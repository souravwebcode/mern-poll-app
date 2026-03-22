export const checkExpiry = (req, res, next) => {
  const poll = req.poll;

  if (!poll) return next();

  const now = new Date();
  const isExpired = new Date(poll.expiry) < now;

  // Attach status to poll
  poll.status = isExpired ? "Expired" : "Active";

  // Save flag for later use
  req.isExpired = isExpired;

  next();
};