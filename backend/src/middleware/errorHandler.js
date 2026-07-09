const errorHandler = (err, req, res, _next) => {
  console.error('Unhandled error:', err);

  if (err.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists.' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced resource not found.' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body.' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error.',
  });
};

export default errorHandler;
