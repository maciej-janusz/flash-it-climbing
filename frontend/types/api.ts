export type RouteType = "boulder" | "lead";

export type Route = {
  id: string;
  name: string;
  grade: string;
  crag_id: string;
  crag_name: string;
  type: RouteType;
};

export type Crag = {
  id: string;
  name: string;
  area: string;
  country_id: string;
  country_name: string;
  description?: string | null;
};

export type CreateRouteRequest = {
  name: string;
  grade: string;
  type: RouteType;
  crag_id: string;
};

export type CreateCragRequest = {
  name: string;
  area: string;
  country_id: string;
};

export type Country = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  picture?: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};
