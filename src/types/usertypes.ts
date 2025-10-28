export type User = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
};

export type Role = "ADMIN" | "USER" | "DELIVERY";
