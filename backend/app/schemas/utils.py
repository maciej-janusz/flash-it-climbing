from typing import Annotated, TypeVar
from pydantic import BaseModel, Field, ConfigDict, PlainSerializer, WithJsonSchema
from beanie import PydanticObjectId

PyObjectId = Annotated[
    PydanticObjectId,
    PlainSerializer(lambda x: str(x), return_type=str),
    WithJsonSchema({"type": "string", "example": "65f1a2b3c4d5e6f7a8b9c0d1"})
]

T = TypeVar("T")
Hidden = Annotated[T, Field(exclude=True)]

class BasicModel(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

class IndexedModel(BasicModel):
    id: PyObjectId = Field(alias="_id")