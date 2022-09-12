const getPagesAndOffset = (results, pageSize, currentPage) => {
  const pages = Math.ceil(results / pageSize);
  const offset = 
    results > pageSize && currentPage <= pages ? 
    (currentPage - 1) * pageSize : 0;

  return  {
    pages,
    offset
  }
}

module.exports = {
  getPagesAndOffset
}