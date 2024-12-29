export type User = {
  id: string;
  email: string;
  name: string;
  location: string;
  avatar: string;
  password: string;
  following: User[];
};

export type GetUserByIdRes = {
  user: User;
};

export type GetUsersRes = {
  users: User[];
};

export type GoogleLoginInput = {
  email: string;
  name: string;
  avatar: string;
};
