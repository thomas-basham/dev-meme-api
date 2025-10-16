export interface Meme {
  id?: number;
  title: string;
  url: string;
  userId: number;
}

// @types/express/index.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}
