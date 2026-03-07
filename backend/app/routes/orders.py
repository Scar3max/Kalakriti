"""
Order routes — prototype order placement (no payment).
"""

from fastapi import APIRouter, HTTPException
from app.models.order import OrderCreate, OrderResponse
from app.database import get_db

router = APIRouter()


@router.post("/", response_model=dict)
async def place_order(order: OrderCreate):
    """Place a prototype order (no real payment)."""
    db = get_db()
    
    # Needs a valid product price, let's look it up
    product_res = db.table("products").select("price").eq("id", order.product_id).execute()
    if not product_res.data:
        raise HTTPException(status_code=404, detail="Product not found")
        
    price = product_res.data[0]["price"]

    # In a real app we'd match buyer_email to a users table via Supabase Auth
    # but here we'll just insert standard record
    response = db.table("orders").insert({
        "product_id": order.product_id,
        "amount": price,
        "status": "pending"
    }).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to place order")
        
    return {
        "message": "Order placed (prototype)",
        "order_id": response.data[0]["id"],
        "payment_status": "prototype",
    }


@router.get("/{order_id}", response_model=dict)
async def get_order(order_id: str):
    """Get order details / receipt."""
    db = get_db()
    response = db.table("orders").select("*, products(*)").eq("id", order_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order": response.data[0]}

