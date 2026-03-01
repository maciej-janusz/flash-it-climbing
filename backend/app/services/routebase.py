from beanie import PydanticObjectId
from bson.errors import InvalidId
from typing import List, Optional, Iterable
from fastapi import HTTPException, status
from pydantic import BaseModel
from app.models.routebase import Route, Crag, Country
from app.utils import RouteType
from pymongo.errors import DuplicateKeyError
from app.schemas.routebase import RouteCreate, CragCreate
from .utils import clean_string
import asyncio
import re

class RoutebaseService:
    @staticmethod
    async def fetch_crags_by_country(country_id: str) -> List[Crag]:
        """Fetch all crags for a specific country."""
        try:
            country_id = PydanticObjectId(country_id)
        except (TypeError, ValueError, InvalidId):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        crags = await Crag.find(Crag.country_id == country_id).sort(+Crag.name).to_list()
        return crags
    
    @staticmethod
    async def fetch_all_countries() -> List[Country]:
        """Fetch all countries sorted by name."""
        countries = await Country.find_all().sort(+Country.name).to_list()
        return countries
    
    @staticmethod
    async def fetch_routes_by_crag(crag_id: str) -> List[Route]:
        """Fetch all routes for a specific crag."""
        try:
            crag_id = PydanticObjectId(crag_id)
        except (TypeError, ValueError, InvalidId):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        routes = await Route.find(Route.crag_id == crag_id).sort(+Route.name).to_list()
        return routes
    
    @staticmethod
    async def fetch_crag(crag_id: str) -> Crag:
        """Fetch a single crag by its ID."""
        try:
            crag_id = PydanticObjectId(crag_id)
        except (TypeError, ValueError, InvalidId):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        crag = await Crag.get(crag_id)
        if not crag:
            raise HTTPException(status_code=404, detail="Crag not found")
        return crag
    
    @staticmethod
    async def fetch_route(route_id: str) -> Route:
        """Fetch a single route by its ID."""
        try:
            route_id = PydanticObjectId(route_id)
        except (TypeError, ValueError, InvalidId):
            raise HTTPException(status_code=400, detail="Invalid ID format")

        route = await Route.get(route_id)
        if not route:
            raise HTTPException(status_code=404, detail="Route not found")
        return route
    
    @staticmethod
    async def add_route(crag_id: str, name: str, grade: str, route_type: RouteType) -> Route:
        """Add a new route to the database."""
        try:
            crag_id = PydanticObjectId(crag_id)
        except (TypeError, ValueError, InvalidId):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        crag = await Crag.get(crag_id)
        if not crag:
            raise HTTPException(status_code=404, detail="Crag not found")
        
        try:
            route_type = RouteType(route_type)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid type. allowed: lead, boulder")

        grade = grade.lower()
        search_tokens = RoutebaseService._generate_weighted_tokens([name, crag.name, grade])

        route = Route(
            name=name,
            grade=grade,
            crag_id=crag_id,
            crag_name=crag.name,
            type=route_type,
            search_tokens=search_tokens
        )

        try:
            route = await route.insert()
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Route already exists")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid fields")
        return route
    
    @staticmethod
    async def add_crag(country_id: str, name: str, area: str, description: Optional[str] = None) -> Crag:
        """Add a new crag to the database."""
        try:
            country_id = PydanticObjectId(country_id)
        except (TypeError, ValueError, InvalidId):
            raise HTTPException(status_code=400, detail="Invalid ID format")

        country = await Country.get(country_id)
        if not country:
            raise HTTPException(status_code=404, detail="Country not found")
        
        search_tokens = RoutebaseService._generate_weighted_tokens([name, area, country.name])
        crag = Crag(
            country_id=country_id, 
            name=name, 
            area=area, 
            description=description, 
            country_name=country.name,
            search_tokens = search_tokens
        )
        try:
            crag = await crag.insert()
        except DuplicateKeyError:
            raise HTTPException(status_code=400, detail="Crag already exists")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid fields")
        return crag
    
    @staticmethod
    async def search_route(query: str, page: int = 1, limit: int = 10, crag_id: Optional[str] = None) -> List[Route]:
        """Perform a weighted search for routes."""
        q = clean_string(query).lower().strip()
        words = list(filter(lambda x: len(x) >= 2, q.split()))
        if not words:
            return []

        q_regex = "|".join(re.escape(word) for word in words)

        match_filter = {"search_tokens": {"$all": words}}

        if crag_id:
            match_filter["crag_id"] = PydanticObjectId(crag_id)

        pipeline = [
            {"$match": match_filter},

            {"$addFields": {
                "search_score": {
                    "$add": [
                        {"$cond": [{"$regexMatch": {"input": "$name", "regex": q_regex, "options": "i"}}, 100, 0]},
                        {"$cond": [{"$regexMatch": {"input": "$crag_name", "regex": q_regex, "options": "i"}}, 50, 0]},
                        {"$cond": [{"$regexMatch": {"input": "$grade", "regex": q_regex, "options": "i"}}, 20, 0]}
                    ]
                }
            }},
            
            {"$sort": {"search_score": -1}},

            {"$skip": (max(1, page) - 1) * limit},
            {"$limit": limit}
        ]

        return await Route.aggregate(pipeline).to_list()
    
    @staticmethod
    async def search_crag(query: str, page: int = 1, limit: int = 10, country_id: Optional[str] = None) -> List[Crag]:
        """Perform a weighted search for crags."""
        q = clean_string(query).lower().strip()
        words = list(filter(lambda x: len(x) >= 2, q.split()))
        if not words:
            return []

        q_regex = "|".join(re.escape(word) for word in words)

        match_filter = {"search_tokens": {"$all": words}}

        if country_id:
            match_filter["country_id"] = PydanticObjectId(country_id)

        pipeline = [
            {"$match": match_filter},

            {"$addFields": {
                "search_score": {
                    "$add": [
                        {"$cond": [{"$regexMatch": {"input": "$name", "regex": q_regex, "options": "i"}}, 100, 0]},
                        {"$cond": [{"$regexMatch": {"input": "$area", "regex": q_regex, "options": "i"}}, 50, 0]},
                        {"$cond": [{"$regexMatch": {"input": "$country_name", "regex": q_regex, "options": "i"}}, 20, 0]}
                    ]
                }
            }},
            
            {"$sort": {"search_score": -1}},

            {"$skip": (max(1, page) - 1) * limit},
            {"$limit": limit}
        ]

        return await Crag.aggregate(pipeline).to_list()

    
    @staticmethod
    async def add_routes(payloads: List[RouteCreate]):
        sem = asyncio.Semaphore(10)

        async def safe_add(p: RouteCreate):
            async with sem:
                return await RoutebaseService.add_route(
                    p.crag_id, p.name, p.grade, p.type
                )

        tasks = [safe_add(p) for p in payloads]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        final_results = []
        errors = []

        for res in results:
            if isinstance(res, Exception):
                errors.append(str(res))
            else:
                final_results.append(res)

        if not final_results and errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail={"message": "All operations failed", "errors": errors}
            )

        return final_results
    
    @staticmethod
    async def add_crags(payloads: List[CragCreate]):
        sem = asyncio.Semaphore(10)

        async def safe_add(p: CragCreate):
            async with sem:
                return await RoutebaseService.add_crag(
                    p.country_id, p.name, p.area, p.description
                )

        tasks = [safe_add(p) for p in payloads]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        final_results = []
        errors = []

        for res in results:
            if isinstance(res, Exception):
                errors.append(str(res))
            else:
                final_results.append(res)

        if not final_results and errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail={"message": "All operations failed", "errors": errors}
            )

        return final_results 

    @staticmethod
    def _generate_weighted_tokens(items: Iterable[str]) -> List[str]:
        tokens = set()
        
        for item in items:
            for word in clean_string(item).lower().split():
                for i in range(2, len(word) + 1):
                    tokens.add(word[:i])
        
        return list(tokens)