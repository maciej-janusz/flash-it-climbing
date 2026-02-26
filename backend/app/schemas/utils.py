from typing import Annotated, Any
from pydantic import BeforeValidator, BaseModel, Field, ConfigDict
from beanie import PydanticObjectId

PyObjectId = Annotated[
    str, 
    BeforeValidator(lambda x: str(x) if isinstance(x, PydanticObjectId) or not isinstance(x, str) else x)
]

class IndexedModel(BaseModel):
    id: PyObjectId = Field(alias="_id")
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )