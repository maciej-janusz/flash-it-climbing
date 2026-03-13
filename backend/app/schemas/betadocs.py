from enum import Enum
from pydantic import Field
from typing import Literal, Optional
from utils import BasicModel

class ItemType(Enum):
    DESC = "desc"
    MEDIA = "media"
    SCHEME = "scheme"

class MediaType(Enum):
    IMAGE = "image"
    VIDEO = "video"

class HoldType(Enum):
    CRIMP = "crimp"
    JUG = "jug"
    SLOPER = "sloper"
    PINCH = "pinch"
    POCKET = "pocket"

class Hold(BasicModel):
    type: HoldType = Field(..., description="Type of hold")
    x: float = Field(..., ge=0, le=1, description="X coordinate of the hold (0-1)")
    y: float = Field(..., ge=0, le=1, description="Y coordinate of the hold (0-1)")
    size: float = Field(..., ge=0, le=1, description="Size of the hold (0-1)")
    angle: float = Field(..., ge=0, le=360, description="Angle of the hold in degrees")

class ImageMedia(BasicModel):
    media_type: Literal[MediaType.IMAGE] = MediaType.IMAGE
    url: str = Field(..., description="URL of the media")
    alt_text: str

class VideoMedia(BasicModel):
    media_type: Literal[MediaType.VIDEO] = MediaType.VIDEO
    video_url: str = Field(..., description="URL of the video")
    thumbnail_url: str = Field(..., description="URL of the thumbnail")
    duration_seconds: int

# BetaItem = Annotated[
#     Union[RouteScheme, RouteMedia, RouteDescription],
#     Field(discriminator="item_type")
# ]

class BetaSetName(BasicModel):
    name: str = Field(..., min_length=2, max_length=64, description="Name of the beta")

class BetaCreate(BetaSetName):
    pass

class Operation(Enum):
    ADD = "add"
    REMOVE = "remove"

class BetaUpdate(BasicModel):
    item_type: ItemType
    operation: Operation = Field(..., description="add or remove")
    order: int = Field(-1, description="Order of the element. -1 means at the end")

class SchemeSetImage(BasicModel):
    image_url: str = Field(..., description="URL of the route scheme image")
    height: int = Field(..., description="height of image")
    width: int = Field(..., description="width of image")

class SchemeUpdateCanvas(BasicModel):
    canvas_url: str = Field(None, description="URL of the canvas image for the route scheme")

class AddHold(BasicModel):
    order: int = Field(-1, description="Order of the hold. -1 means at the end")
    hold: Hold

class RemoveHold(BasicModel):
    order: int = Field(-1, description="Order of the hold. -1 means at the end")

class UpdateHold(AddHold):
    pass

class InsertText(BasicModel):
    start_pos: int = Field(-1, description="position to insert. -1 means at the end")
    text: str = Field(..., description="text to insert")

class DeleteText(BasicModel):
    start_pos: int = Field(-1, description="position to insert. -1 means at the end")
    num_of_chars: int = Field(..., description="num of chars to delete")