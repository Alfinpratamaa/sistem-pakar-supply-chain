export type AnswerType = { [key: string]: number };
export type ResultType = { [key: string]: number };

export interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}
