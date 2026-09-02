class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(filter = {}) {
    return await this.model.find(filter);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findOne(filter = {}) {
    return await this.model.findOne(filter);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  /**
   * Universal pagination logic
   */
  async paginate(filter = {}, options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = Math.min(parseInt(options.limit, 10) || 20, 100); // Max 100
    const skip = (page - 1) * limit;

    let query = this.model.find(filter);

    if (options.populate) {
      query = query.populate(options.populate);
    }

    if (options.sort) {
      query = query.sort(options.sort);
    } else {
      query = query.sort('-createdAt');
    }

    query = query.skip(skip).limit(limit);

    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = BaseRepository;
