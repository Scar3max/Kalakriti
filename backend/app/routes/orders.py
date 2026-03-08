"""
Order routes — prototype order placement (no payment).
"""

from fastapi import APIRouter, HTTPException
import uuid
from app.models.order import OrderCreate, OrderResponse
from app.database import get_db

router = APIRouter()


@router.post("/", response_model=dict)
async def place_order(order: OrderCreate):
    """Place a prototype order (no real payment)."""
    db = get_db()

    # Look up product price using correct PK column
    product_res = (
        db.table("products")
        .select("price, artisan_id")
        .eq("product_id", order.product_id)
        .execute()
    )
    if not product_res.data:
        raise HTTPException(status_code=404, detail="Product not found")

    price = product_res.data[0]["price"]

    # Build the order record matching the DB schema
    order_data = {
        "order_id": str(uuid.uuid4()),
        "product_id": order.product_id,
        "total_amount": price,
        "currency": "INR",
        "payment_status": "pending",
        "shipping_status": "not_shipped",
        "shipping_address": {
            "name": order.buyer_name,
            "email": order.buyer_email,
            "phone": order.buyer_phone or "",
            "message": order.message or "",
        },
    }

    # Add buyer_id if provided (from authenticated user)
    if order.buyer_id:
        order_data["buyer_id"] = order.buyer_id

    response = db.table("orders").insert(order_data).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to place order")

    return {
        "message": "Order placed (prototype)",
        "order_id": response.data[0]["order_id"],
        "payment_status": "prototype",
    }


@router.get("/{order_id}", response_model=dict)
async def get_order(order_id: str):
    """Get order details / receipt."""
    db = get_db()
    response = (
        db.table("orders")
        .select("*, order_items(*, products(title, image_url, price))")
        .eq("order_id", order_id)
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order": response.data[0]}
