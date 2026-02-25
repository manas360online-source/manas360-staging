export function respondInternalError(res, publicMessage, error, logContext) {
  const context = logContext ? `${logContext}:` : 'Unhandled error:';
  console.error(context, error);

  return res.status(500).json({
    success: false,
    message: publicMessage
  });
}
