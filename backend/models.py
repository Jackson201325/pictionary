from typing    import Optional, List
from sqlmodel  import SQLModel, Field, Relationship

class Room(SQLModel, table=True):
    id:      str              = Field(primary_key=True, index=True)
    strokes: List["Stroke"]   = Relationship(back_populates="room")


class Stroke(SQLModel, table=True):
    id:      Optional[int]    = Field(default=None, primary_key=True)
    room_id: str              = Field(foreign_key="room.id", index=True)
    x0:      float
    y0:      float
    x1:      float
    y1:      float
    room:    Optional[Room]   = Relationship(back_populates="strokes")
