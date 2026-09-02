const { ApiError } = require('../utils/apiResponse');

/**
 * Middleware to validate request against Zod schema
 * @param {Object} schema - Zod schema object with optional body, query, and params
 */
const validate = (schema) => async (req, res, next) => {
  try {
    if (schema.body) {
      req.body = await schema.body.parseAsync(req.body);
    }
    if (schema.query) {
      req.query = await schema.query.parseAsync(req.query);
    }
    if (schema.params) {
      req.params = await schema.params.parseAsync(req.params);
    }
    next();
  } catch (error) {
    // Format Zod errors
    const errors = error.issues?.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })) || [];
    
    next(new ApiError(400, 'Validation Error', errors));
  }
};

module.exports = validate;
