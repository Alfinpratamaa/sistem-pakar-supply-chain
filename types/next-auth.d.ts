import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    password?: string; // The question mark should be on the type, not the property name
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    name: string;
  }
}
