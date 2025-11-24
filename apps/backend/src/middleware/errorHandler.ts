import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    })
  }

  res.status(500).json({
    error: 'Internal server error',
    statusCode: 500,
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
}
