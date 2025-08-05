export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  lastLogin: Date;
  lastUpdated: Date;
}

export interface UserAuth{
  email: string,
  password: string,
}
