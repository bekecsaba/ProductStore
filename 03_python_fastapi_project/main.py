from contextlib import asynccontextmanager
from typing import List
import uuid

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database import Product, CartItem, create_tables, get_db


class ProductCreate(BaseModel):
    name: str
    price: float
    description: str | None = None
    stock: int

class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    description: str | None = None
    stock: int | None = None

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    description: str | None = None
    stock: int

    class Config:
        from_attributes = True


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    session_id: str


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    session_id: str
    product: ProductResponse

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_items: int
    total_price: float


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:5174", "http://localhost:5174"],  # Vite's default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Homework"}


@app.get("/products/", response_model=List[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    products = result.scalars().all()
    return products


@app.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    db_product = await db.get(Product, product_id)

    if not db_product:
        raise HTTPException(status_code=404, detail="Product NOT registered")

    return db_product


@app.post("/products/", response_model=ProductResponse)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).filter(Product.name == product.name))
    db_product = result.first()

    if db_product:
        raise HTTPException(status_code=400, detail="Product already registered")

    db_product = Product(name=product.name, price=product.price, description=product.description, stock=product.stock)
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product


@app.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product: ProductUpdate, db: AsyncSession = Depends(get_db)):
    db_product = await db.get(Product, product_id)

    if not db_product:
        raise HTTPException(status_code=404, detail="Product NOT registered")

    if product.name:
        db_product.name = product.name
    if product.price:
        db_product.price = product.price
    if product.description:
        db_product.description = product.description
    if product.stock:
        db_product.stock = product.stock

    await db.commit()
    await db.refresh(db_product)
    return db_product


@app.get("/products/{product_id}/can-delete")
async def can_delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    # Check if product exists
    db_product = await db.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product NOT registered")

    # Check if product is in any shopping cart
    cart_items_result = await db.execute(
        select(CartItem).filter(CartItem.product_id == product_id)
    )
    cart_items = cart_items_result.scalars().all()

    return {
        "can_delete": len(cart_items) == 0,
        "cart_count": len(cart_items),
        "message": f"Product is in {len(cart_items)} shopping cart(s)" if cart_items else "Product can be deleted"
    }


@app.delete("/products/{product_id}")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    db_product = await db.get(Product, product_id)

    if not db_product:
        raise HTTPException(status_code=404, detail="Product NOT registered")

    # Check if product is in any shopping cart
    cart_items_result = await db.execute(
        select(CartItem).filter(CartItem.product_id == product_id)
    )
    cart_items = cart_items_result.scalars().all()

    if cart_items:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete product '{db_product.name}' because it is currently in {len(cart_items)} shopping cart(s). Please remove it from all carts first."
        )

    await db.delete(db_product)
    await db.commit()
    return {"message": "Product successfully deleted!"}


# Cart endpoints
@app.post("/cart/add", response_model=CartItemResponse)
async def add_to_cart(cart_item: CartItemCreate, db: AsyncSession = Depends(get_db)):
    # Check if product exists and has enough stock
    db_product = await db.get(Product, cart_item.product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check existing cart item for this session and product
    result = await db.execute(
        select(CartItem).filter(
            and_(
                CartItem.product_id == cart_item.product_id,
                CartItem.session_id == cart_item.session_id
            )
        )
    )
    existing_cart_item = result.scalar_one_or_none()

    if existing_cart_item:
        # Update quantity if item already in cart
        new_quantity = existing_cart_item.quantity + cart_item.quantity
        if new_quantity > db_product.stock:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock. Available: {db_product.stock}, Requested: {new_quantity}"
            )
        existing_cart_item.quantity = new_quantity
        await db.commit()
        await db.refresh(existing_cart_item)
        # Load product relationship
        product_result = await db.execute(select(Product).filter(Product.id == existing_cart_item.product_id))
        existing_cart_item.product = product_result.scalar_one()
        return existing_cart_item
    else:
        # Create new cart item
        if cart_item.quantity > db_product.stock:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock. Available: {db_product.stock}, Requested: {cart_item.quantity}"
            )

        db_cart_item = CartItem(
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            session_id=cart_item.session_id
        )
        db.add(db_cart_item)
        await db.commit()
        await db.refresh(db_cart_item)
        # Load product relationship
        product_result = await db.execute(select(Product).filter(Product.id == db_cart_item.product_id))
        db_cart_item.product = product_result.scalar_one()
        return db_cart_item


@app.get("/cart/{session_id}", response_model=CartResponse)
async def get_cart(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CartItem).filter(CartItem.session_id == session_id)
    )
    cart_items = result.scalars().all()

    # Load products for each cart item
    for item in cart_items:
        product_result = await db.execute(select(Product).filter(Product.id == item.product_id))
        item.product = product_result.scalar_one()

    # Calculate totals
    total_items = sum(item.quantity for item in cart_items)
    total_price = sum(item.quantity * item.product.price for item in cart_items)

    return CartResponse(
        items=cart_items,
        total_items=total_items,
        total_price=total_price
    )


@app.delete("/cart/{session_id}/{product_id}")
async def remove_from_cart(session_id: str, product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CartItem).filter(
            and_(
                CartItem.session_id == session_id,
                CartItem.product_id == product_id
            )
        )
    )
    cart_item = result.scalar_one_or_none()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    await db.delete(cart_item)
    await db.commit()
    return {"message": "Item removed from cart"}


@app.put("/cart/update", response_model=CartItemResponse)
async def update_cart_item(cart_item: CartItemCreate, db: AsyncSession = Depends(get_db)):
    # Find existing cart item
    result = await db.execute(
        select(CartItem).filter(
            and_(
                CartItem.product_id == cart_item.product_id,
                CartItem.session_id == cart_item.session_id
            )
        )
    )
    existing_cart_item = result.scalar_one_or_none()

    if not existing_cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    # Check stock availability
    db_product = await db.get(Product, cart_item.product_id)
    if cart_item.quantity > db_product.stock:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough stock. Available: {db_product.stock}, Requested: {cart_item.quantity}"
        )

    # Update quantity
    existing_cart_item.quantity = cart_item.quantity
    await db.commit()
    await db.refresh(existing_cart_item)
    # Load product relationship
    product_result = await db.execute(select(Product).filter(Product.id == existing_cart_item.product_id))
    existing_cart_item.product = product_result.scalar_one()
    return existing_cart_item


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
