export function logSecurityEvent(event, details = {}) {
  const payload = {
    level: 'security',
    event,
    timestamp: new Date().toISOString(),
    ...details
  };

  console.log(JSON.stringify(payload));
}

export default {
  logSecurityEvent
};
