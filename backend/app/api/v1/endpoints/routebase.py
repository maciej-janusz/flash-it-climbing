from fastapi import APIRouter, Depends
from typing import List, Optional

from app.services.routebase import RoutebaseService
from app.schemas.routebase import RouteCreate, RouteOut, CragCreate, CragOut, CountryOut
from app.auth.auth_config import fastapi_users

router = APIRouter(prefix="/v1/routebase", tags=["Route"])

#get
@router.get("/routes/{crag_id}", response_model=List[RouteOut])
async def get_routes(crag_id: str):
    """Fetch all routes for a given crag ID."""
    return await RoutebaseService.fetch_routes_by_crag(crag_id)

@router.get("/route/{route_id}", response_model=RouteOut)
async def get_route_by_id(route_id: str):
    """Fetch a single route by its ID."""
    return await RoutebaseService.fetch_route(route_id)

@router.get("/crags/{country_id}", response_model=List[CragOut])
async def get_crags_by_country(country_id: str) -> List[CragOut]:
    """Fetch all crags for a given country ID."""
    return await RoutebaseService.fetch_crags_by_country(country_id)

@router.get("/crag/{crag_id}", response_model=CragOut)
async def get_crag_by_id(crag_id: str) -> CragOut:
    """Fetch a single crag by its ID."""
    return await RoutebaseService.fetch_crag(crag_id)

@router.get("/countries", response_model=List[CountryOut])
async def get_countries():
    """Fetch all available countries."""
    return await RoutebaseService.fetch_all_countries()

@router.get("/search/route", response_model=List[RouteOut])
async def search_route(query: str, page: int = 1, crag_id: Optional[str] = None):
    """Search for routes by query string, optionally filtered by crag."""
    return await RoutebaseService.search_route(query, page=page, crag_id=crag_id)

@router.get("/search/crag", response_model=List[CragOut])
async def search_crag(query: str, page: int = 1, country_id: Optional[str] = None):
    """Search for crags by query string, optionally filtered by country."""
    return await RoutebaseService.search_crag(query, page=page, country_id=country_id)

current_active_user = fastapi_users.current_user(active=True)

#post
@router.post("/route", response_model=RouteOut)
async def add_route(payload: RouteCreate, user=Depends(current_active_user)):
    """Add a new route to a crag. Requires authentication."""
    return await RoutebaseService.add_route(payload.crag_id, payload.name, payload.grade, payload.type, user)

@router.post("/crag", response_model=CragOut)
async def add_crag(payload: CragCreate, user=Depends(current_active_user)):
    """Add a new crag. Requires authentication."""
    return await RoutebaseService.add_crag(payload.country_id, payload.name, payload.area, user)

@router.post("/routes", response_model=List[RouteOut])
async def add_routes(payloads: List[RouteCreate], user=Depends(current_active_user)):
    """Batch add multiple routes. Requires authentication."""
    return await RoutebaseService.add_routes(payloads, user)

@router.post("/crags", response_model=List[CragOut])
async def add_crags(payloads: List[CragCreate], user=Depends(current_active_user)):
    """Batch add multiple crags. Requires authentication."""
    return await RoutebaseService.add_crags(payloads, user)