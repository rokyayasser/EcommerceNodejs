class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((field) => delete queryStringObj[field]);

    const filterConditions = [];
    const queryObj = {};
    Object.keys(queryStringObj).forEach((key) => {
      if (key.includes("[")) {
        const [field, operator] = key.split(/\[|\]/);
        if (!queryObj[field]) queryObj[field] = {};
        queryObj[field][`$${operator}`] = Number(queryStringObj[key]);
      } else {
        queryObj[key] = queryStringObj[key];
      }
    });
    filterConditions.push(queryObj);
    this.mongooseQuery = this.mongooseQuery.find(
      filterConditions.length > 1
        ? { $and: filterConditions }
        : filterConditions[0]
    );

    return this; //returning the object itself
  }

  sort() {
    if (this.queryString.sort) {
      const sortFields = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this; //returning the object itself
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this; //returning the object itself
  }

  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      });
    }
    return this; //returning the object itself
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this; //returning the object itself
  }
}

module.exports = ApiFeatures;
