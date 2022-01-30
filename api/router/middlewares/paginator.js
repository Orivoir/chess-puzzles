module.exports = function(request, response, next){

  let {page, limitPerPage} = request.query;
  
  page = parseInt(page);
  limitPerPage = parseInt(limitPerPage);

  if(isNaN(page) || !isFinite(page) || page < 0) {
    page = 1;
  }

  if(isNaN(limitPerPage) || !isFinite(limitPerPage) || limitPerPage < 1) {
    limitPerPage = 5;
  }

  const countSkip = (limitPerPage * (page - 1));

  request.paginator = {
    countSkip,
    limitPerPage,
    page
  };

  next();
};
