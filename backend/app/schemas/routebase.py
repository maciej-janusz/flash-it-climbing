from typing import Optional
from pydantic import Field
from app.schemas.utils import PyObjectId, IndexedModel, BasicModel
from app.utils import RouteType

class RouteCreate(BasicModel):
    name: str = Field(..., min_length=2, max_length=64, description="Name of the route")
    grade: str = Field(..., min_length=2, max_length=3, description="Grade of the route", pattern=r"^[4-9][a-cA-C]\+?$")
    crag_id: PyObjectId = Field(..., description="ID of the associated crag")
    type: RouteType = Field(..., description="Either lead or boulder")

class RouteOut(RouteCreate, IndexedModel):
    crag_name: str = Field(..., min_length=2, max_length=64, description="Name of the associated crag")


class CragCreate(BasicModel):
    name: str = Field(..., min_length=2, max_length=64, description="Name of the crag")
    area: str = Field(..., min_length=2, max_length=64, description="area of the crag")
    country_id: PyObjectId = Field(..., description="ID of the associated country")
    description: Optional[str] = Field(None, min_length=2, max_length=512, description="Description of the crag")

class CragOut(CragCreate, IndexedModel):
    country_name: str = Field(..., min_length=2, max_length=64, description="Country where the crag is located")



class CountryOut(IndexedModel):
    name: str = Field(..., min_length=2, max_length=64,  description="Name of the country")
    flag: str
