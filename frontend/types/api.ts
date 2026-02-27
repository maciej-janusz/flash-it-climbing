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
