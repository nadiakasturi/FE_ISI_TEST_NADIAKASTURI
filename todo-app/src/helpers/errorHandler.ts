import { z } from 'zod';

type CustomError = {
  message?: string;
  status?: number;
  issues?: z.ZodIssue[]; 
};

export default function errorHandler(error: CustomError) {
  let message = error.message || "Internal server error";
  let status = error.status || 500; 

  if (error.issues) {
    message = error.issues[0].message;
    status = 400; 
  }

  return Response.json(
    {
      message: message,
    },
    {
      status: status,
    }
  );
}
