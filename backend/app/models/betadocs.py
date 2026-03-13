from typing import Optional, List, Literal, Annotated, Union

from pymongo import IndexModel
from beanie import Link
from pydantic import Field
from app.models.utils import BaseDocument
from app.schemas.betadocs import ImageMedia, VideoMedia, ItemType, Hold

class BaseBetaItem(BaseDocument):
    item_type: ItemType
    
    class Settings:
        name = "items"
        is_root = True


class RouteMedia(BaseBetaItem):
    item_type: Literal[ItemType.MEDIA] = ItemType.MEDIA
    content: Annotated[Union[ImageMedia, VideoMedia], Field(discriminator="media_type")]

class RouteDescription(BaseBetaItem):
    item_type: Literal[ItemType.DESC] = ItemType.DESC
    description: str = Field(..., min_length=2, max_length=512, description="Description of the route")

class RouteScheme(BaseBetaItem):
    item_type: Literal[ItemType.SCHEME] = ItemType.SCHEME
    image_url: str = Field(..., description="URL of the route scheme image")
    height: int = Field(..., description="height of image")
    width: int = Field(..., description="width of image")
    holds: List[Hold] = Field(..., description="List of holds on the route")
    canvas_url: Optional[str] = Field(None, description="URL of the canvas image for the route scheme")



class BetaDocument(BaseDocument):
    name: str = Field(..., min_length=2, max_length=64, description="Name of the document")
    items: List[Link[BaseBetaItem]] = Field(..., "items for this document")

    class Settings:
        name = "betadocs"
        indexes = [
            IndexModel(
                [
                    ("author_id", 1), 
                ]
            ),
        ]