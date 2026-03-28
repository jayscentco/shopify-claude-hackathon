#!/usr/bin/env python3
"""
Seed mock data directly into SQLite — no Shopify API needed.
Uses the same product/customer catalog from seed.py.

Usage: cd backend && python seed_local.py
"""
import asyncio
import json
import random
import sys
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from seed import PRODUCTS, CUSTOMERS, COLLECTIONS
from seed_orders import CHANNELS, _CHANNEL_POOL, DISCOUNT_CODES, FIRST_NAMES, LAST_NAMES

from app.database import init_db, async_session_factory
from sqlalchemy import text


def _random_email(first: str, last: str) -> str:
    domains = ["example.com", "test.io", "hackathon.dev", "demo.org", "mail.test"]
    return f"{first.lower()}.{last.lower()}{random.randint(1, 999)}@{random.choice(domains)}"


def _random_past_date(days_back: int = 30) -> str:
    delta = timedelta(
        days=random.randint(0, days_back),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
    )
    dt = datetime.now(timezone.utc) - delta
    return dt.isoformat()


def _pick_attribution(product_handle: str) -> dict:
    channel = random.choice(_CHANNEL_POOL)
    campaign = random.choice(channel["campaigns"])
    content = random.choice(campaign["contents"])
    source = channel["source"]
    medium = channel["medium"]
    camp = campaign["campaign"]

    if source == "direct":
        return {"landing_site": f"/products/{product_handle}", "referring_site": None}

    landing = (
        f"/products/{product_handle}"
        f"?utm_source={source}&utm_medium={medium}"
        f"&utm_campaign={camp}&utm_content={content}"
    )
    return {"landing_site": landing, "referring_site": channel["referring_site"]}


async def seed():
    await init_db()
    async with async_session_factory() as db:
        now = datetime.now(timezone.utc).isoformat()

        # --- Products ---
        product_records = []
        for i, prod in enumerate(PRODUCTS):
            pid = f"gid://shopify/Product/{10000 + i}"
            handle = prod["title"].lower().replace(" ", "-").replace("(", "").replace(")", "").replace("/", "-")
            variants = []
            total_inv = 0
            prices = []
            for j, v in enumerate(prod["variants"]):
                vid = f"gid://shopify/ProductVariant/{20000 + i * 100 + j}"
                variants.append({
                    "id": vid,
                    "title": v["title"],
                    "sku": v["sku"],
                    "price": v["price"],
                    "inventory_quantity": v["inventory"],
                })
                total_inv += v["inventory"]
                prices.append(float(v["price"]))

            collections = [prod["collection"]]
            record = {
                "id": pid,
                "title": prod["title"],
                "handle": handle,
                "status": "active",
                "product_type": prod["type"],
                "vendor": prod["vendor"],
                "price_min": min(prices),
                "price_max": max(prices),
                "variants": json.dumps(variants),
                "collections": json.dumps(collections),
                "featured_image_url": None,
                "inventory_total": total_inv,
                "created_at": now,
                "updated_at": now,
            }
            product_records.append(record)

            await db.execute(
                text("""
                    INSERT OR REPLACE INTO products
                        (id, title, handle, status, product_type, vendor,
                         price_min, price_max, variants, collections,
                         featured_image_url, inventory_total, created_at, updated_at)
                    VALUES
                        (:id, :title, :handle, :status, :product_type, :vendor,
                         :price_min, :price_max, :variants, :collections,
                         :featured_image_url, :inventory_total, :created_at, :updated_at)
                """),
                record,
            )

        print(f"Seeded {len(product_records)} products")

        # --- Customers ---
        customer_records = []
        for i, cust in enumerate(CUSTOMERS):
            cid = f"gid://shopify/Customer/{30000 + i}"
            record = {
                "id": cid,
                "email": cust["email"],
                "first_name": cust["first_name"],
                "last_name": cust["last_name"],
                "orders_count": random.randint(1, 15),
                "total_spent": round(random.uniform(50, 2000), 2),
                "tags": json.dumps(cust["tags"]),
                "created_at": _random_past_date(90),
                "last_order_at": _random_past_date(14),
            }
            customer_records.append(record)

            await db.execute(
                text("""
                    INSERT OR REPLACE INTO customers
                        (id, email, first_name, last_name, orders_count,
                         total_spent, tags, created_at, last_order_at)
                    VALUES
                        (:id, :email, :first_name, :last_name, :orders_count,
                         :total_spent, :tags, :created_at, :last_order_at)
                """),
                record,
            )

        print(f"Seeded {len(customer_records)} customers")

        # --- Orders (75 orders spread over past 30 days) ---
        order_count = 75
        for i in range(order_count):
            oid = f"gid://shopify/Order/{40000 + i}"
            order_number = f"#{1001 + i}"

            # Pick 1-4 random products for line items
            num_items = random.randint(1, 4)
            chosen_products = random.sample(product_records, min(num_items, len(product_records)))

            line_items = []
            subtotal = 0.0
            primary_handle = chosen_products[0]["handle"]

            for prod_rec in chosen_products:
                variants = json.loads(prod_rec["variants"])
                variant = random.choice(variants)
                qty = random.randint(1, 3)
                price = float(variant["price"])
                amount = price * qty
                subtotal += amount
                line_items.append({
                    "id": f"gid://shopify/LineItem/{uuid.uuid4().hex[:12]}",
                    "title": prod_rec["title"],
                    "quantity": qty,
                    "amount": round(amount, 2),
                    "variant_id": variant["id"],
                    "product_id": prod_rec["id"],
                })

            # Discount
            discount = 0.0
            discount_codes = []
            if random.random() < 0.20:
                code = random.choice(DISCOUNT_CODES)
                pct = random.choice([10, 15, 20, 25])
                discount = round(subtotal * pct / 100, 2)
                discount_codes = [{"code": code, "amount": str(discount), "type": "percentage"}]

            tax = round((subtotal - discount) * 0.08, 2)
            total = round(subtotal - discount + tax, 2)

            # Pick a customer
            cust_rec = random.choice(customer_records)

            # Financial status
            fin_status = "paid"
            r = random.random()
            if r < 0.05:
                fin_status = "refunded"
            elif r < 0.08:
                fin_status = "partially_refunded"
            elif r < 0.12:
                fin_status = "pending"

            # Fulfillment
            ful_status = "fulfilled"
            r2 = random.random()
            if r2 < 0.15:
                ful_status = "unfulfilled"
            elif r2 < 0.25:
                ful_status = "partial"

            # Attribution
            attribution = _pick_attribution(primary_handle)
            processed_at = _random_past_date(30)

            await db.execute(
                text("""
                    INSERT OR REPLACE INTO orders
                        (id, order_number, total_price, subtotal_price,
                         total_discounts, total_tax, currency, financial_status,
                         fulfillment_status, line_items, customer_id, customer_email,
                         customer_name, discount_codes, landing_site, referring_site,
                         processed_at, created_at, is_simulated)
                    VALUES
                        (:id, :order_number, :total_price, :subtotal_price,
                         :total_discounts, :total_tax, :currency, :financial_status,
                         :fulfillment_status, :line_items, :customer_id,
                         :customer_email, :customer_name, :discount_codes,
                         :landing_site, :referring_site, :processed_at, :created_at,
                         :is_simulated)
                """),
                {
                    "id": oid,
                    "order_number": order_number,
                    "total_price": total,
                    "subtotal_price": round(subtotal, 2),
                    "total_discounts": discount,
                    "total_tax": tax,
                    "currency": "USD",
                    "financial_status": fin_status,
                    "fulfillment_status": ful_status,
                    "line_items": json.dumps(line_items),
                    "customer_id": cust_rec["id"],
                    "customer_email": cust_rec["email"],
                    "customer_name": f"{cust_rec['first_name']} {cust_rec['last_name']}",
                    "discount_codes": json.dumps(discount_codes),
                    "landing_site": attribution["landing_site"],
                    "referring_site": attribution["referring_site"],
                    "processed_at": processed_at,
                    "created_at": now,
                    "is_simulated": False,
                },
            )

        print(f"Seeded {order_count} orders with UTM attribution")
        await db.commit()
        print("Done! Mock data ready in hackathon.db")


if __name__ == "__main__":
    asyncio.run(seed())
