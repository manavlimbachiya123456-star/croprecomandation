exports.notFound = (req, _res, next) => {
  const e = new Error(`Route not found: ${req.method} ${req.originalUrl}`); e.status = 404; next(e);
};

exports.errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';
  if (err.code === 11000) { status = 409; message = 'Email or mobile is already registered'; }
  if (err.name === 'ValidationError') { status = 400; }
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? 'Internal server error' : message });
};
