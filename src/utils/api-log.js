const apiLog = (...params) => {
  const dateTime = new Date();
  console.log(`[${dateTime.toLocaleString()}]`, ...params)
};

export default apiLog;
