"""
Order model — prototype order receipt (no actual payment).
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class OrderCreate(BaseModel):
    """Fields required to place a prototype order."""
    product_id: str
    buyer_id: Optional[str] = None
    buyer_name: str = "Guest"
    buyer_email: str = "guest@example.com"
    buyer_phone: Optional[str] = None
    message: Optional[str] = None


class OrderResponse(BaseModel):
    """Order receipt returned to the buyer."""
    order_id: str
    product_id: str
    buyer_id: Optional[str] = None
    total_amount: float
    currency: str = "INR"
    payment_status: str = "pending"
    shipping_status: str = "not_shipped"
    created_at: datetime

    class Config:
        from_attributes = True
