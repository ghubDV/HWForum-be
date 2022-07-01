const currentMinutes = () => {
  return Math.floor(Date.now() / 1000 / 60);
}

module.exports = {
  currentMinutes
}