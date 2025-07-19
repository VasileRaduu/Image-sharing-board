import { ApiResponse, createPaginationResponse, formatValidationErrors } from '../../src/utils/responseHelper.js';

describe('ApiResponse', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('success should return correct response', () => {
    const data = { id: 1, name: 'test' };
    const message = 'Success message';

    ApiResponse.success(mockRes, data, message, 200);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message,
      data,
      timestamp: expect.any(String)
    });
  });

  test('error should return correct error response', () => {
    const message = 'Error message';
    const details = { field: 'test' };

    ApiResponse.error(mockRes, message, 400, details);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: message,
      details,
      timestamp: expect.any(String)
    });
  });

  test('created should return 201 status', () => {
    ApiResponse.created(mockRes, { id: 1 });

    expect(mockRes.status).toHaveBeenCalledWith(201);
  });

  test('notFound should return 404 status', () => {
    ApiResponse.notFound(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  test('badRequest should return 400 status', () => {
    ApiResponse.badRequest(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test('unauthorized should return 401 status', () => {
    ApiResponse.unauthorized(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  test('forbidden should return 403 status', () => {
    ApiResponse.forbidden(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(403);
  });

  test('conflict should return 409 status', () => {
    ApiResponse.conflict(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(409);
  });

  test('tooManyRequests should return 429 status', () => {
    ApiResponse.tooManyRequests(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(429);
  });

  test('internalError should return 500 status', () => {
    ApiResponse.internalError(mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});

describe('createPaginationResponse', () => {
  test('should create correct pagination response', () => {
    const data = [{ id: 1 }, { id: 2 }];
    const page = 1;
    const limit = 10;
    const total = 25;

    const result = createPaginationResponse(data, page, limit, total);

    expect(result).toEqual({
      data,
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 25,
        itemsPerPage: 10,
        hasNextPage: true,
        hasPrevPage: false
      }
    });
  });
});

describe('formatValidationErrors', () => {
  test('should format validation errors correctly', () => {
    const errors = [
      { path: 'email', msg: 'Invalid email', value: 'test' },
      { path: 'password', msg: 'Password too short', value: '123' }
    ];

    const result = formatValidationErrors(errors);

    expect(result).toEqual([
      { field: 'email', message: 'Invalid email', value: 'test' },
      { field: 'password', message: 'Password too short', value: '123' }
    ]);
  });
}); 