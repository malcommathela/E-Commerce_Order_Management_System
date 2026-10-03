-- Expanded development seed data for the E-Commerce Order Management System.
-- Creates 10 categories, 15 suppliers, 60 products, 100 customers,
-- 300 orders, 600 order items, 300 payments, and one development admin.
--
-- Safe re-run guard: if the seed admin already exists, the script skips
-- the entire seed operation. To reseed, reset the development schema first.
-- IMPORTANT: Run only against a development database.

DECLARE
    v_existing_admin NUMBER;
    v_existing_count NUMBER;
    v_admin_id       NUMBER;
    v_category_id    NUMBER;
    v_supplier_id    NUMBER;
    v_product_id     NUMBER;
    v_customer_id    NUMBER;
    v_order_id       NUMBER;
    v_product_id_1   NUMBER;
    v_product_id_2   NUMBER;
    v_price_1        NUMBER(10,2);
    v_price_2        NUMBER(10,2);
    v_total          NUMBER(12,2);
    v_customer_count NUMBER;
    v_product_count  NUMBER;
    v_order_status   VARCHAR2(50);
    v_payment_method VARCHAR2(50);
    v_payment_status VARCHAR2(50);
    v_category_name  VARCHAR2(100);
    v_supplier_name  VARCHAR2(200);
BEGIN
    SELECT COUNT(*) INTO v_existing_admin
    FROM PRODUCT
    WHERE sku = 'DEMO-SKU-001';

    IF v_existing_admin = 0 THEN
        -- Development administrator. Preserve an existing admin user.
        SELECT COUNT(*) INTO v_existing_count FROM USERS WHERE username = 'admin';
        IF v_existing_count = 0 THEN
        INSERT INTO USERS (
            username, email, password_hash, first_name, last_name, role,
            email_verified, is_active, last_login_at, created_at, updated_at
        ) VALUES (
            'admin',
            'root@gmail.com',
            '$2b$12$39P3LjZcNIce57echsjQ3.Ux/yFwIjVpUsqt73pYHweFUjqNaI8g.',
            'System',
            'Administrator',
            'ADMIN',
            1,
            1,
            SYSTIMESTAMP,
            SYSTIMESTAMP,
            SYSTIMESTAMP
        ) RETURNING user_id INTO v_admin_id;
        END IF;

        -- 1. Categories (10)
        FOR i IN 1..10 LOOP
            v_category_name := CASE i
                WHEN 1 THEN 'Electronics'
                WHEN 2 THEN 'Clothing'
                WHEN 3 THEN 'Home & Kitchen'
                WHEN 4 THEN 'Books'
                WHEN 5 THEN 'Sports & Outdoors'
                WHEN 6 THEN 'Beauty & Personal Care'
                WHEN 7 THEN 'Toys & Games'
                WHEN 8 THEN 'Office Supplies'
                WHEN 9 THEN 'Footwear'
                ELSE 'Accessories'
            END;

            SELECT COUNT(*) INTO v_existing_count
            FROM CATEGORY WHERE name = v_category_name;
            IF v_existing_count = 0 THEN
                INSERT INTO CATEGORY (name, description)
                VALUES (v_category_name,
                        'Demo catalogue category: ' || v_category_name);
            END IF;
        END LOOP;

        -- 2. Suppliers (15)
        FOR i IN 1..15 LOOP
            v_supplier_name := CASE MOD(i - 1, 5)
                WHEN 0 THEN 'Prime Retail Supply'
                WHEN 1 THEN 'Metro Wholesale'
                WHEN 2 THEN 'Value Source Traders'
                WHEN 3 THEN 'BlueSky Distributors'
                ELSE 'Summit Goods Co'
            END || ' ' || TO_CHAR(i, 'FM00');

            SELECT COUNT(*) INTO v_existing_count
            FROM SUPPLIER
            WHERE contact_email = 'supplier' || TO_CHAR(i, 'FM000') || '@example.com';
            IF v_existing_count = 0 THEN
                INSERT INTO SUPPLIER (name, contact_email, phone, address)
                VALUES (
                    v_supplier_name,
                    'supplier' || TO_CHAR(i, 'FM000') || '@example.com',
                    '90000' || TO_CHAR(10000 + i),
                    'Warehouse ' || TO_CHAR(i, 'FM00') || ', ' ||
                    CASE MOD(i - 1, 5)
                        WHEN 0 THEN 'Mumbai'
                        WHEN 1 THEN 'Delhi'
                        WHEN 2 THEN 'Bengaluru'
                        WHEN 3 THEN 'Hyderabad'
                        ELSE 'Chennai'
                    END
                );
            END IF;
        END LOOP;

        -- 3. Products and inventory (60).
        -- Stock is deliberately generous so order-item trigger deductions
        -- remain valid throughout the sample order generation.
        FOR i IN 1..60 LOOP
            SELECT category_id INTO v_category_id
            FROM CATEGORY
            WHERE name = CASE MOD(i - 1, 10)
                WHEN 0 THEN 'Electronics' WHEN 1 THEN 'Clothing'
                WHEN 2 THEN 'Home & Kitchen' WHEN 3 THEN 'Books'
                WHEN 4 THEN 'Sports & Outdoors' WHEN 5 THEN 'Beauty & Personal Care'
                WHEN 6 THEN 'Toys & Games' WHEN 7 THEN 'Office Supplies'
                WHEN 8 THEN 'Footwear' ELSE 'Accessories' END
            FETCH FIRST 1 ROW ONLY;

            SELECT supplier_id INTO v_supplier_id
            FROM SUPPLIER
            WHERE contact_email = 'supplier' || TO_CHAR(MOD(i - 1, 15) + 1, 'FM000') || '@example.com';

            INSERT INTO PRODUCT (
                category_id, supplier_id, name, description, price, sku,
                stock_quantity
            ) VALUES (
                v_category_id,
                v_supplier_id,
                'Demo Product ' || TO_CHAR(i, 'FM000'),
                'Seeded catalogue item ' || TO_CHAR(i, 'FM000') ||
                ' for local development and dashboard testing.',
                ROUND(99 + MOD(i * 137, 15000) + (MOD(i, 4) * 0.25), 2),
                'DEMO-SKU-' || TO_CHAR(i, 'FM000'),
                500
            ) RETURNING product_id INTO v_product_id;

            INSERT INTO INVENTORY (
                product_id, warehouse_location, quantity_available
            ) VALUES (
                v_product_id,
                'WH-' ||
                CASE MOD(i - 1, 5)
                    WHEN 0 THEN 'MUM'
                    WHEN 1 THEN 'DEL'
                    WHEN 2 THEN 'BLR'
                    WHEN 3 THEN 'HYD'
                    ELSE 'CHE'
                END || '-' || TO_CHAR(MOD(i - 1, 20) + 1, 'FM00'),
                500
            );
        END LOOP;

        -- 4. Customers (100)
        FOR i IN 1..100 LOOP
            SELECT COUNT(*) INTO v_existing_count FROM CUSTOMER
            WHERE email = 'customer' || TO_CHAR(i, 'FM000') || '@example.com';
            IF v_existing_count = 0 THEN
            INSERT INTO CUSTOMER (
                first_name, last_name, email, phone, address, city, postal_code
            ) VALUES (
                CASE MOD(i - 1, 10)
                    WHEN 0 THEN 'Aarav'
                    WHEN 1 THEN 'Priya'
                    WHEN 2 THEN 'Rahul'
                    WHEN 3 THEN 'Ananya'
                    WHEN 4 THEN 'Arjun'
                    WHEN 5 THEN 'Diya'
                    WHEN 6 THEN 'Ishaan'
                    WHEN 7 THEN 'Meera'
                    WHEN 8 THEN 'Kabir'
                    ELSE 'Sana'
                END,
                'Customer' || TO_CHAR(i, 'FM000'),
                'customer' || TO_CHAR(i, 'FM000') || '@example.com',
                '91' || TO_CHAR(7000000000 + i),
                TO_CHAR(100 + i) || ' Market Road',
                CASE MOD(i - 1, 8)
                    WHEN 0 THEN 'Mumbai'
                    WHEN 1 THEN 'Delhi'
                    WHEN 2 THEN 'Bengaluru'
                    WHEN 3 THEN 'Hyderabad'
                    WHEN 4 THEN 'Chennai'
                    WHEN 5 THEN 'Pune'
                    WHEN 6 THEN 'Kolkata'
                    ELSE 'Visakhapatnam'
                END,
                TO_CHAR(400000 + MOD(i * 37, 59999))
            );
            END IF;
        END LOOP;

        -- 5. Orders, order items and payments (300 orders / 600 items).
        -- Each order has two distinct products. The order total is calculated
        -- from the same unit prices saved in ORDER_ITEM.
        FOR i IN 1..300 LOOP
            SELECT customer_id INTO v_customer_id
            FROM (
                SELECT customer_id,
                       ROW_NUMBER() OVER (ORDER BY customer_id) AS rn
                FROM CUSTOMER
                WHERE email LIKE 'customer___@example.com'
            )
            WHERE rn = MOD(i - 1, 100) + 1;

            v_order_status := CASE MOD(i - 1, 5)
                WHEN 0 THEN 'PENDING'
                WHEN 1 THEN 'CONFIRMED'
                WHEN 2 THEN 'SHIPPED'
                WHEN 3 THEN 'DELIVERED'
                ELSE 'CANCELLED'
            END;

            INSERT INTO ORDERS (
                customer_id, order_date, status, total_amount, shipping_address
            ) VALUES (
                v_customer_id,
                SYSTIMESTAMP - NUMTODSINTERVAL(MOD(i * 7, 180), 'DAY'),
                v_order_status,
                0,
                (SELECT address || ', ' || city
                 FROM CUSTOMER
                 WHERE customer_id = v_customer_id)
            ) RETURNING order_id INTO v_order_id;

            SELECT product_id, price INTO v_product_id_1, v_price_1
            FROM (
                SELECT product_id, price,
                       ROW_NUMBER() OVER (ORDER BY product_id) AS rn
                FROM PRODUCT
                WHERE sku LIKE 'DEMO-SKU-%'
            )
            WHERE rn = MOD((i * 2) - 2, 60) + 1;

            SELECT product_id, price INTO v_product_id_2, v_price_2
            FROM (
                SELECT product_id, price,
                       ROW_NUMBER() OVER (ORDER BY product_id) AS rn
                FROM PRODUCT
                WHERE sku LIKE 'DEMO-SKU-%'
            )
            WHERE rn = MOD((i * 2) - 1, 60) + 1;

            INSERT INTO ORDER_ITEM (order_id, product_id, quantity, unit_price)
            VALUES (v_order_id, v_product_id_1, 1 + MOD(i, 3), v_price_1);

            INSERT INTO ORDER_ITEM (order_id, product_id, quantity, unit_price)
            VALUES (v_order_id, v_product_id_2, 1 + MOD(i + 1, 2), v_price_2);

            SELECT SUM(quantity * unit_price) INTO v_total
            FROM ORDER_ITEM
            WHERE order_id = v_order_id;

            UPDATE ORDERS
            SET total_amount = v_total
            WHERE order_id = v_order_id;

            v_payment_method := CASE MOD(i - 1, 5)
                WHEN 0 THEN 'UPI'
                WHEN 1 THEN 'CREDIT_CARD'
                WHEN 2 THEN 'DEBIT_CARD'
                WHEN 3 THEN 'NET_BANKING'
                ELSE 'COD'
            END;

            v_payment_status := CASE v_order_status
                WHEN 'PENDING' THEN 'PENDING'
                WHEN 'CANCELLED' THEN 'REFUNDED'
                ELSE 'COMPLETED'
            END;

            INSERT INTO PAYMENT (
                order_id, payment_method, amount, payment_status, transaction_date
            ) VALUES (
                v_order_id,
                v_payment_method,
                v_total,
                v_payment_status,
                SYSTIMESTAMP - NUMTODSINTERVAL(MOD(i * 5, 180), 'DAY')
            );
        END LOOP;

        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Expanded seed data created successfully.');
        DBMS_OUTPUT.PUT_LINE('Created 1 admin, 10 categories, 15 suppliers,');
        DBMS_OUTPUT.PUT_LINE('60 products, 60 inventory rows, 100 customers,');
        DBMS_OUTPUT.PUT_LINE('300 orders, 600 order items and 300 payments.');
    ELSE
        DBMS_OUTPUT.PUT_LINE(
            'Seed skipped: expanded demo products already exist. ' ||
            'No duplicate expanded dataset was inserted.'
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;