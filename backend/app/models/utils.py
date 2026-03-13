from datetime import datetime
from typing import Optional
from beanie import Document, Replace, SaveChanges, before_event
from pydantic import Field
from beanie import PydanticObjectId

class BaseDocument(Document):
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = Field(default_factory=datetime.now)
    author_id: Optional[PydanticObjectId] = Field(None, description="ID of the user who created the document")

    @before_event([Replace, SaveChanges])
    def update_timestamp(self):
        self.updated_at = datetime.now()

    class Settings:
        use_state_management = True

