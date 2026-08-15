DECLARE
-- Customer IDs
v_cust1 NUMBER;
    v_cust2 NUMBER;
    v_cust3 NUMBER;

    -- Supplier IDs
    v_sup1 NUMBER;
    v_sup2 NUMBER;
    v_sup3 NUMBER;

    -- Category IDs
    v_cat1 NUMBER;
    v_cat2 NUMBER;
    v_cat3 NUMBER;

    -- Product IDs
    v_prod1 NUMBER;
    v_prod2 NUMBER;
    v_prod3 NUMBER;
    v_prod4 NUMBER;
    v_prod5 NUMBER;

    -- Order IDs
    v_ord1 NUMBER;
    v_ord2 NUMBER;
    v_ord3 NUMBER;

BEGIN

    ----------------------------------------------------------------------
    -- 1. CATEGORIES
    ----------------------------------------------------------------------

INSERT INTO CATEGORY (name, description)
VALUES (
           'Electronics',
           'Gadgets, devices, and accessories'
       )
    RETURNING category_id INTO v_cat1;

INSERT INTO CATEGORY (name, description)
VALUES (
           'Clothing',
           'Apparel and fashion accessories'
       )
    RETURNING category_id INTO v_cat2;

INSERT INTO CATEGORY (name, description)
VALUES (
           'Home & Kitchen',
           'Household and kitchen essentials'
       )
    RETURNING category_id INTO v_cat3;


----------------------------------------------------------------------
-- 2. SUPPLIERS
----------------------------------------------------------------------

INSERT INTO SUPPLIER (
    name,
    contact_email,
    phone,
    address
)
VALUES (
           'TechSource Inc',
           'contact@techsource.com',
           '9876543210',
           'Andheri East, Mumbai'
       )
    RETURNING supplier_id INTO v_sup1;

INSERT INTO SUPPLIER (
    name,
    contact_email,
    phone,
    address
)
VALUES (
           'FashionHub',
           'hello@fashionhub.com',
           '9876543211',
           'Connaught Place, Delhi'
       )
    RETURNING supplier_id INTO v_sup2;

INSERT INTO SUPPLIER (
    name,
    contact_email,
    phone,
    address
)
VALUES (
           'HomeMart',
           'support@homemart.com',
           '9876543212',
           'Koramangala, Bangalore'
       )
    RETURNING supplier_id INTO v_sup3;


----------------------------------------------------------------------
-- 3. PRODUCTS
-- Each product is linked to a CATEGORY and SUPPLIER
----------------------------------------------------------------------

INSERT INTO PRODUCT (
    category_id,
    supplier_id,
    name,
    description,
    price,
    sku,
    stock_quantity
)
VALUES (
           v_cat1,
           v_sup1,
           'Wireless Earbuds Pro',
           'Bluetooth 5.3 with ANC',
           2999.00,
           'EAR-001',
           100
       )
    RETURNING product_id INTO v_prod1;

INSERT INTO PRODUCT (
    category_id,
    supplier_id,
    name,
    description,
    price,
    sku,
    stock_quantity
)
VALUES (
           v_cat1,
           v_sup1,
           'Smart Watch Series 5',
           'Fitness tracking, AMOLED display',
           4999.00,
           'WATCH-001',
           50
       )
    RETURNING product_id INTO v_prod2;

INSERT INTO PRODUCT (
    category_id,
    supplier_id,
    name,
    description,
    price,
    sku,
    stock_quantity
)
VALUES (
           v_cat2,
           v_sup2,
           'Cotton T-Shirt',
           'Premium organic cotton',
           799.00,
           'TEE-001',
           200
       )
    RETURNING product_id INTO v_prod3;

INSERT INTO PRODUCT (
    category_id,
    supplier_id,
    name,
    description,
    price,
    sku,
    stock_quantity
)
VALUES (
           v_cat2,
           v_sup2,
           'Denim Jeans',
           'Slim fit stretch denim',
           1499.00,
           'JEAN-001',
           150
       )
    RETURNING product_id INTO v_prod4;

INSERT INTO PRODUCT (
    category_id,
    supplier_id,
    name,
    description,
    price,
    sku,
    stock_quantity
)
VALUES (
           v_cat3,
           v_sup3,
           'Non-Stick Cookware Set',
           '5-piece induction friendly',
           2499.00,
           'COOK-001',
           80
       )
    RETURNING product_id INTO v_prod5;


----------------------------------------------------------------------
-- 4. INVENTORY
-- Each inventory record is linked to a PRODUCT
----------------------------------------------------------------------

INSERT INTO INVENTORY (
    product_id,
    warehouse_location,
    quantity_available
)
VALUES (
           v_prod1,
           'WH-Mumbai-A1',
           100
       );

INSERT INTO INVENTORY (
    product_id,
    warehouse_location,
    quantity_available
)
VALUES (
           v_prod2,
           'WH-Mumbai-A2',
           50
       );

INSERT INTO INVENTORY (
    product_id,
    warehouse_location,
    quantity_available
)
VALUES (
           v_prod3,
           'WH-Delhi-B1',
           200
       );

INSERT INTO INVENTORY (
    product_id,
    warehouse_location,
    quantity_available
)
VALUES (
           v_prod4,
           'WH-Delhi-B2',
           150
       );

INSERT INTO INVENTORY (
    product_id,
    warehouse_location,
    quantity_available
)
VALUES (
           v_prod5,
           'WH-Bangalore-C1',
           80
       );


----------------------------------------------------------------------
-- 5. CUSTOMERS
----------------------------------------------------------------------

INSERT INTO CUSTOMER (
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    postal_code
)
VALUES (
           'Rahul',
           'Sharma',
           'rahul@example.com',
           '9876543210',
           '123 MG Road',
           'Mumbai',
           '400001'
       )
    RETURNING customer_id INTO v_cust1;

INSERT INTO CUSTOMER (
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    postal_code
)
VALUES (
           'Priya',
           'Patel',
           'priya@example.com',
           '9876543211',
           '456 CP Road',
           'Delhi',
           '110001'
       )
    RETURNING customer_id INTO v_cust2;

INSERT INTO CUSTOMER (
    first_name,
    last_name,
    email,
    phone,
    address,
    city,
    postal_code
)
VALUES (
           'Amit',
           'Kumar',
           'amit@example.com',
           '9876543212',
           '789 Brigade Road',
           'Bangalore',
           '560001'
       )
    RETURNING customer_id INTO v_cust3;


----------------------------------------------------------------------
-- 6. ORDERS
-- Each order is linked to a CUSTOMER
----------------------------------------------------------------------

INSERT INTO ORDERS (
    customer_id,
    status,
    total_amount,
    shipping_address
)
VALUES (
           v_cust1,
           'CONFIRMED',
           2999.00,
           '123 MG Road, Mumbai'
       )
    RETURNING order_id INTO v_ord1;

INSERT INTO ORDERS (
    customer_id,
    status,
    total_amount,
    shipping_address
)
VALUES (
           v_cust2,
           'PENDING',
           3097.00,
           '456 CP Road, Delhi'
       )
    RETURNING order_id INTO v_ord2;

INSERT INTO ORDERS (
    customer_id,
    status,
    total_amount,
    shipping_address
)
VALUES (
           v_cust1,
           'SHIPPED',
           4999.00,
           '123 MG Road, Mumbai'
       )
    RETURNING order_id INTO v_ord3;


----------------------------------------------------------------------
-- 7. ORDER ITEMS
-- Each item links an ORDER to a PRODUCT
-- Trigger automatically reduces INVENTORY
----------------------------------------------------------------------

INSERT INTO ORDER_ITEM (
    order_id,
    product_id,
    quantity,
    unit_price
)
VALUES (
           v_ord1,
           v_prod1,
           1,
           2999.00
       );

INSERT INTO ORDER_ITEM (
    order_id,
    product_id,
    quantity,
    unit_price
)
VALUES (
           v_ord2,
           v_prod3,
           2,
           799.00
       );

INSERT INTO ORDER_ITEM (
    order_id,
    product_id,
    quantity,
    unit_price
)
VALUES (
           v_ord2,
           v_prod4,
           1,
           1499.00
       );

INSERT INTO ORDER_ITEM (
    order_id,
    product_id,
    quantity,
    unit_price
)
VALUES (
           v_ord3,
           v_prod2,
           1,
           4999.00
       );


----------------------------------------------------------------------
-- 8. PAYMENTS
-- Each payment is linked to an ORDER
----------------------------------------------------------------------

INSERT INTO PAYMENT (
    order_id,
    payment_method,
    amount,
    payment_status
)
VALUES (
           v_ord1,
           'UPI',
           2999.00,
           'COMPLETED'
       );

INSERT INTO PAYMENT (
    order_id,
    payment_method,
    amount,
    payment_status
)
VALUES (
           v_ord2,
           'CREDIT_CARD',
           3097.00,
           'PENDING'
       );

INSERT INTO PAYMENT (
    order_id,
    payment_method,
    amount,
    payment_status
)
VALUES (
           v_ord3,
           'DEBIT_CARD',
           4999.00,
           'COMPLETED'
       );


----------------------------------------------------------------------
-- COMMIT ALL DATA
----------------------------------------------------------------------

COMMIT;

END;
/