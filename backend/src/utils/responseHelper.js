// Standardized response helper for consistent API responses

export class ApiResponse {
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message = "An error occurred", statusCode = 500, details = null) {
    const response = {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };

    if (details) {
      response.details = details;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data = null, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  static badRequest(res, message = "Bad request", details = null) {
    return this.error(res, message, 400, details);
  }

  static unauthorized(res, message = "Unauthorized") {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = "Forbidden") {
    return this.error(res, message, 403);
  }

  static conflict(res, message = "Conflict") {
    return this.error(res, message, 409);
  }

  static tooManyRequests(res, message = "Too many requests") {
    return this.error(res, message, 429);
  }

  static internalError(res, message = "Internal server error") {
    return this.error(res, message, 500);
  }
}

// Pagination helper
export const createPaginationResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

// Validation error formatter
export const formatValidationErrors = (errors) => {
  return errors.map(error => ({
    field: error.path,
    message: error.msg,
    value: error.value
  }));
}; 