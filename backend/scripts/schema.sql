DROP TABLE PAYMENT CASCADE CONSTRAINTS
/

DROP TABLE ORDER_ITEM CASCADE CONSTRAINTS
/

DROP TABLE ORDERS CASCADE CONSTRAINTS
/

DROP TABLE INVENTORY CASCADE CONSTRAINTS
/

DROP TABLE PRODUCT CASCADE CONSTRAINTS
/

DROP TABLE CATEGORY CASCADE CONSTRAINTS
/

DROP TABLE SUPPLIER CASCADE CONSTRAINTS
/

DROP TABLE CUSTOMER CASCADE CONSTRAINTS
/

DROP TABLE USERS CASCADE CONSTRAINTS
/

CREATE TABLE USERS (
                       user_id                 NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       username                VARCHAR2(100) NOT NULL UNIQUE,
                       email                   VARCHAR2(255) NOT NULL UNIQUE,
                       password_hash           VARCHAR2(255) NOT NULL,
                       first_name              VARCHAR2(100) NOT NULL,
                       last_name               VARCHAR2(100) NOT NULL,
                       role                    VARCHAR2(50) DEFAULT 'MANAGER'
                            CHECK (role IN ('ADMIN', 'MANAGER', 'STAFF')),
                       email_verified          NUMBER(1) DEFAULT 0
                            CHECK (email_verified IN (0, 1)),
                       verification_code       VARCHAR2(10),
                       verification_expires_at TIMESTAMP,
                       is_active               NUMBER(1) DEFAULT 1
                            CHECK (is_active IN (0, 1)),
                       last_login_at           TIMESTAMP,
                       created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at              TIMESTAMP
)
    /

CREATE TABLE CUSTOMER (
                          customer_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          first_name      VARCHAR2(100) NOT NULL,
                          last_name       VARCHAR2(100) NOT NULL,
                          email           VARCHAR2(255) NOT NULL UNIQUE,
                          phone           VARCHAR2(20),
                          address         VARCHAR2(500),
                          city            VARCHAR2(100),
                          postal_code     VARCHAR2(20),
                          created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
    /

CREATE TABLE SUPPLIER (
                          supplier_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          name            VARCHAR2(200) NOT NULL,
                          contact_email   VARCHAR2(255),
                          phone           VARCHAR2(20),
                          address         VARCHAR2(500),
                          created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
    /

CREATE TABLE CATEGORY (
                          category_id     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          name            VARCHAR2(100) NOT NULL,
                          description     VARCHAR2(500)
)
    /

CREATE TABLE PRODUCT (
                         product_id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         category_id     NUMBER NOT NULL,
                         supplier_id     NUMBER,
                         name            VARCHAR2(200) NOT NULL,
                         description     VARCHAR2(1000),
                         price           NUMBER(10,2) NOT NULL CHECK (price >= 0),
                         sku             VARCHAR2(100) UNIQUE,
                         stock_quantity  NUMBER DEFAULT 0 CHECK (stock_quantity >= 0),
                         created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES CATEGORY(category_id),
                         CONSTRAINT fk_product_supplier FOREIGN KEY (supplier_id) REFERENCES SUPPLIER(supplier_id)
)
    /

CREATE TABLE INVENTORY (
                           inventory_id        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           product_id          NUMBER NOT NULL UNIQUE,
                           warehouse_location  VARCHAR2(200),
                           quantity_available  NUMBER DEFAULT 0 CHECK (quantity_available >= 0),
                           last_updated        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES PRODUCT(product_id)
)
    /

CREATE TABLE ORDERS (
                        order_id            NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                        customer_id         NUMBER NOT NULL,
                        order_date          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        status              VARCHAR2(50) DEFAULT 'PENDING'
                        CHECK (status IN ('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED')),
                        total_amount        NUMBER(12,2) DEFAULT 0,
                        shipping_address    VARCHAR2(500),
                        CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id)
)
    /

CREATE TABLE ORDER_ITEM (
                            order_item_id   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                            order_id        NUMBER NOT NULL,
                            product_id      NUMBER NOT NULL,
                            quantity        NUMBER NOT NULL CHECK (quantity > 0),
                            unit_price      NUMBER(10,2) NOT NULL,
                            subtotal        NUMBER(12,2) GENERATED ALWAYS AS (quantity * unit_price),
                            CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES ORDERS(order_id) ON DELETE CASCADE,
                            CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES PRODUCT(product_id)
)
    /

CREATE TABLE PAYMENT (
                         payment_id          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         order_id            NUMBER NOT NULL UNIQUE,
                         payment_method      VARCHAR2(50) CHECK (payment_method IN ('CREDIT_CARD','DEBIT_CARD','UPI','NET_BANKING','COD')),
                         amount              NUMBER(12,2) NOT NULL,
                         payment_status      VARCHAR2(50) DEFAULT 'PENDING'
                        CHECK (payment_status IN ('PENDING','COMPLETED','FAILED','REFUNDED')),
                         transaction_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES ORDERS(order_id)
)
    /

CREATE INDEX idx_users_email       ON USERS(email)
    /

CREATE INDEX idx_users_username    ON USERS(username)
    /

CREATE INDEX idx_users_role        ON USERS(role)
    /

CREATE INDEX idx_users_active      ON USERS(is_active)
    /

CREATE INDEX idx_orders_customer   ON ORDERS(customer_id)
    /

CREATE INDEX idx_orders_status     ON ORDERS(status)
    /

CREATE INDEX idx_oi_order          ON ORDER_ITEM(order_id)
    /

CREATE INDEX idx_oi_product        ON ORDER_ITEM(product_id)
    /

CREATE INDEX idx_product_category  ON PRODUCT(category_id)
    /

CREATE OR REPLACE TRIGGER trg_users_updated_at
BEFORE UPDATE ON USERS
                  FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_update_inventory
AFTER INSERT ON ORDER_ITEM
FOR EACH ROW
BEGIN
UPDATE INVENTORY
SET quantity_available = quantity_available - :NEW.quantity,
    last_updated = CURRENT_TIMESTAMP
WHERE product_id = :NEW.product_id;
END;
/