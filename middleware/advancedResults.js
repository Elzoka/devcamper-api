const advancedResults = (model, populate) => async (req, res, next) => {
    // remove the select query
    const reqQuery = {...req.query};
    const fieldsToRemove = ['select', 'sort', 'page', 'limit'];
    fieldsToRemove.forEach(param => delete reqQuery[param]);
    
    // create operators ($gte, $gt, etc...)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);


    const query = model.find(JSON.parse(queryStr));

    // select query
    if(req.query.select){
        const selectedFields = req.query.select.replace(/[, ]/g, match => match === ',' ? ' ': '');
        query.select(selectedFields);
    }

    // Sorting
    const sortBy = !req.query.sort ? '-createdAt' : req.query.sort.replace(/[, ]/g, match => match === ',' ? ' ': '');
    query.sort(sortBy);
    

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query.skip(startIndex).limit(limit);

    if(populate){
        query.populate(populate);
    }

    // execute query
    const results = await query;

    // Pagination result
    const pagination = {
        next: endIndex < total ? page + 1 : null,
        prev: startIndex > 0 ? page - 1 : null,
        limit
    };

    res.advancedResults = {
        success: true,
        data: {
            count: results.length,
            pagination,
            [model.modelName.toLowerCase()]: results
        }
    }

    next();
}

module.exports = advancedResults;