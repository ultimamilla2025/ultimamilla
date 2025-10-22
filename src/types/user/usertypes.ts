export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Role = "ADMIN" | "USER" | "DELIVERY";
