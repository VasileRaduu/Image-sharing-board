import { protectRoute } from '../../src/middleware/auth.middleware.js';

// Mock Clerk
jest.mock('@clerk/express', () => ({
  getAuth: jest.fn()
}));

import { getAuth } from '@clerk/express';

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call next() when user is authenticated', () => {
    getAuth.mockReturnValue({ userId: 'user123' });

    protectRoute(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  test('should return 401 when no userId is present', () => {
    getAuth.mockReturnValue({ userId: null });

    protectRoute(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('should return 401 when getAuth throws an error', () => {
    getAuth.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    protectRoute(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Authentication failed',
      message: 'Invalid or expired authentication token'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
}); 