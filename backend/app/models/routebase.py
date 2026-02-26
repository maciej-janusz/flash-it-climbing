from typing import Optional, List

from pymongo import IndexModel
from beanie import PydanticObjectId
from pydantic import Field
from .utils import BaseDocument
from app.core.types import RouteType

class Route(BaseDocument):
    name: str = Field(..., min_length=2, max_length=64, description="Name of the route")
    grade: str = Field(..., min_length=2, max_length=3, description="Grade of the route", pattern=r"^[4-9][a-c]\+?$")
    crag_id: PydanticObjectId = Field(..., description="ID of the associated crag")
    crag_name: str = Field(..., min_length=2, max_length=64, description="Name of the associated crag")
    type: RouteType = Field(..., description="Either lead or boulder")
    search_tokens: List[str] = []

    class Settings:
        name = "routes"
        indexes = [
            IndexModel([("type", 1)]),
            IndexModel([("crag_id", 1)]),
            IndexModel([("search_tokens", 1)]),
            IndexModel(
                [
                    ("name", 1), 
                    ("grade", 1), 
                    ("crag_name", 1), 
                    ("crag_country", 1)
                ],
                unique = True
            )
        ]


class Crag(BaseDocument):
    name: str = Field(..., min_length=2, max_length=64, description="Name of the crag")
    area: str = Field(..., min_length=2, max_length=64, description="area of the crag")
    country_id: PydanticObjectId = Field(..., description="ID of the associated country")
    country_name: str = Field(..., min_length=2, max_length=64, description="Country where the crag is located")
    description: Optional[str] = Field(None, min_length=2, max_length=512, description="Description of the crag")
    search_tokens: List[str] = []

    class Settings:
        name = "crags"
        indexes = [
            IndexModel([("country_id", 1)]),
            IndexModel(
                [
                    ("name", 1), 
                    ("area", 1), 
                    ("country_name", 1)
                ], 
                unique = True
            ),
        ]

class Country(BaseDocument):
    name: str = Field(..., min_length=2, max_length=64,  description="Name of the country")
    flag: str

    class Settings:
        name = "countries"
        indexes = [IndexModel([("name", 1)], unique=True)]
