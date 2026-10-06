-- Realistic development seed data for the E-Commerce Order Management System.
-- 10 categories, 15 suppliers, 60 named products, 100 customers,
-- 300 orders, 600 order items and 300 payments.
-- Run only against a development database.

DECLARE
v_existing_seed NUMBER;
    v_existing_count NUMBER;
    v_category_id NUMBER;
    v_supplier_id NUMBER;
    v_product_id NUMBER;
    v_customer_id NUMBER;
    v_order_id NUMBER;
    v_product_id_1 NUMBER;
    v_product_id_2 NUMBER;
    v_price_1 NUMBER(10,2);
    v_price_2 NUMBER(10,2);
    v_total NUMBER(12,2);
    v_order_status VARCHAR2(50);
    v_payment_method VARCHAR2(50);
    v_payment_status VARCHAR2(50);
    v_category_name VARCHAR2(100);
    v_city VARCHAR2(100);

    TYPE str_map IS TABLE OF VARCHAR2(500) INDEX BY PLS_INTEGER;
    TYPE num_map IS TABLE OF NUMBER INDEX BY PLS_INTEGER;
    v_product_names str_map;
    v_product_descriptions str_map;
    v_product_skus str_map;
    v_product_prices num_map;
    v_supplier_names str_map;
    v_first_names str_map;
    v_last_names str_map;
BEGIN
    v_product_names(1) := 'Apple iPhone 15'; v_product_descriptions(1) := 'Apple iPhone 15 with 6.1-inch display and 128GB storage.'; v_product_prices(1) := 69999; v_product_skus(1) := 'ELEC-IPH15-128';
    v_product_names(2) := 'Samsung Galaxy S24'; v_product_descriptions(2) := 'Samsung Galaxy S24 with AMOLED display and 256GB storage.'; v_product_prices(2) := 74999; v_product_skus(2) := 'ELEC-GS24-256';
    v_product_names(3) := 'OnePlus 12'; v_product_descriptions(3) := 'OnePlus 12 smartphone with 256GB storage and fast charging.'; v_product_prices(3) := 64999; v_product_skus(3) := 'ELEC-OP12-256';
    v_product_names(4) := 'Sony WH-1000XM5'; v_product_descriptions(4) := 'Wireless noise-cancelling over-ear headphones.'; v_product_prices(4) := 29999; v_product_skus(4) := 'ELEC-SNY-XM5';
    v_product_names(5) := 'JBL Flip 6'; v_product_descriptions(5) := 'Portable Bluetooth speaker with IP67 water resistance.'; v_product_prices(5) := 9999; v_product_skus(5) := 'ELEC-JBL-FL6';
    v_product_names(6) := 'Logitech MX Master 3S'; v_product_descriptions(6) := 'Wireless ergonomic mouse with MagSpeed scrolling.'; v_product_prices(6) := 8999; v_product_skus(6) := 'ELEC-LGT-MX3';
    v_product_names(7) := 'Levi''s 511 Slim Jeans'; v_product_descriptions(7) := 'Men''s slim-fit denim jeans in a classic dark wash.'; v_product_prices(7) := 3999; v_product_skus(7) := 'CLTH-LVS-511';
    v_product_names(8) := 'Allen Solly Formal Shirt'; v_product_descriptions(8) := 'Men''s cotton formal shirt suitable for office wear.'; v_product_prices(8) := 1999; v_product_skus(8) := 'CLTH-AS-FSH';
    v_product_names(9) := 'Van Heusen Polo T-Shirt'; v_product_descriptions(9) := 'Men''s regular-fit polo shirt in premium cotton.'; v_product_prices(9) := 1799; v_product_skus(9) := 'CLTH-VH-POL';
    v_product_names(10) := 'Biba Printed Kurta'; v_product_descriptions(10) := 'Women''s printed straight kurta with a comfortable cotton blend.'; v_product_prices(10) := 2299; v_product_skus(10) := 'CLTH-BBA-KRT';
    v_product_names(11) := 'H&M Cotton Hoodie'; v_product_descriptions(11) := 'Unisex cotton-blend hooded sweatshirt.'; v_product_prices(11) := 2499; v_product_skus(11) := 'CLTH-HM-HOD';
    v_product_names(12) := 'Roadster Casual Jacket'; v_product_descriptions(12) := 'Lightweight casual jacket for everyday wear.'; v_product_prices(12) := 2999; v_product_skus(12) := 'CLTH-RDS-JKT';
    v_product_names(13) := 'Prestige Induction Cooktop'; v_product_descriptions(13) := 'Induction cooktop with preset cooking modes.'; v_product_prices(13) := 3299; v_product_skus(13) := 'HOME-PRS-IND';
    v_product_names(14) := 'Philips Air Fryer'; v_product_descriptions(14) := 'Digital air fryer with rapid air circulation.'; v_product_prices(14) := 7999; v_product_skus(14) := 'HOME-PHL-AFR';
    v_product_names(15) := 'Milton Thermosteel Flask'; v_product_descriptions(15) := 'Stainless steel insulated flask for hot and cold drinks.'; v_product_prices(15) := 1299; v_product_skus(15) := 'HOME-MLT-FLK';
    v_product_names(16) := 'Borosil Glass Dinner Set'; v_product_descriptions(16) := 'Microwave-safe borosilicate glass dinner set.'; v_product_prices(16) := 2499; v_product_skus(16) := 'HOME-BRS-DNR';
    v_product_names(17) := 'Wakefit Memory Foam Pillow'; v_product_descriptions(17) := 'Ergonomic memory foam pillow for everyday use.'; v_product_prices(17) := 999; v_product_skus(17) := 'HOME-WKF-PIL';
    v_product_names(18) := 'IKEA Storage Organizer'; v_product_descriptions(18) := 'Modular fabric storage organizer for home use.'; v_product_prices(18) := 799; v_product_skus(18) := 'HOME-IKEA-ORG';
    v_product_names(19) := 'Atomic Habits'; v_product_descriptions(19) := 'James Clear''s guide to building lasting habits.'; v_product_prices(19) := 599; v_product_skus(19) := 'BOOK-ATH-HAB';
    v_product_names(20) := 'The Psychology of Money'; v_product_descriptions(20) := 'Morgan Housel''s lessons on money and behavior.'; v_product_prices(20) := 499; v_product_skus(20) := 'BOOK-PSY-MNY';
    v_product_names(21) := 'Clean Code'; v_product_descriptions(21) := 'Robert C. Martin''s guide to writing maintainable software.'; v_product_prices(21) := 699; v_product_skus(21) := 'BOOK-CLN-COD';
    v_product_names(22) := 'The Alchemist'; v_product_descriptions(22) := 'Paulo Coelho''s internationally known novel.'; v_product_prices(22) := 399; v_product_skus(22) := 'BOOK-ALC-NOV';
    v_product_names(23) := 'Ikigai'; v_product_descriptions(23) := 'A practical introduction to the Japanese concept of purpose.'; v_product_prices(23) := 299; v_product_skus(23) := 'BOOK-IKI-LIF';
    v_product_names(24) := 'Rich Dad Poor Dad'; v_product_descriptions(24) := 'Robert Kiyosaki''s personal-finance classic.'; v_product_prices(24) := 499; v_product_skus(24) := 'BOOK-RDP-FIN';
    v_product_names(25) := 'Yonex Nanoflare 700'; v_product_descriptions(25) := 'Badminton racket designed for speed and control.'; v_product_prices(25) := 8999; v_product_skus(25) := 'SPORT-YNX-NF7';
    v_product_names(26) := 'Nivia Storm Football'; v_product_descriptions(26) := 'Training football with durable machine-stitched construction.'; v_product_prices(26) := 1299; v_product_skus(26) := 'SPORT-NIV-FBL';
    v_product_names(27) := 'Decathlon Yoga Mat'; v_product_descriptions(27) := 'Non-slip exercise mat for yoga and floor workouts.'; v_product_prices(27) := 999; v_product_skus(27) := 'SPORT-DCT-YGM';
    v_product_names(28) := 'Adidas Training Shoes'; v_product_descriptions(28) := 'Lightweight training shoes for gym and daily workouts.'; v_product_prices(28) := 5499; v_product_skus(28) := 'SPORT-ADI-TRN';
    v_product_names(29) := 'Cosco Cricket Bat'; v_product_descriptions(29) := 'English-willow cricket bat for recreational and club play.'; v_product_prices(29) := 6999; v_product_skus(29) := 'SPORT-CSC-BAT';
    v_product_names(30) := 'Boldfit Resistance Bands'; v_product_descriptions(30) := 'Set of resistance bands for strength training.'; v_product_prices(30) := 899; v_product_skus(30) := 'SPORT-BDF-BND';
    v_product_names(31) := 'Lakme Absolute Foundation'; v_product_descriptions(31) := 'Long-wear liquid foundation with buildable coverage.'; v_product_prices(31) := 899; v_product_skus(31) := 'BEAU-LKM-FND';
    v_product_names(32) := 'Maybelline Mascara'; v_product_descriptions(32) := 'Volumizing mascara for defined everyday eye makeup.'; v_product_prices(32) := 699; v_product_skus(32) := 'BEAU-MBL-MSC';
    v_product_names(33) := 'Nivea Body Lotion'; v_product_descriptions(33) := 'Moisturizing body lotion for normal to dry skin.'; v_product_prices(33) := 499; v_product_skus(33) := 'BEAU-NIV-BDL';
    v_product_names(34) := 'Mamaearth Face Wash'; v_product_descriptions(34) := 'Gentle daily face wash with a refreshing formula.'; v_product_prices(34) := 399; v_product_skus(34) := 'BEAU-MAM-FWS';
    v_product_names(35) := 'The Derma Co Sunscreen'; v_product_descriptions(35) := 'Broad-spectrum SPF 50 sunscreen for daily use.'; v_product_prices(35) := 599; v_product_skus(35) := 'BEAU-DMC-SUN';
    v_product_names(36) := 'Dove Shampoo'; v_product_descriptions(36) := 'Moisturizing shampoo for smooth and manageable hair.'; v_product_prices(36) := 449; v_product_skus(36) := 'BEAU-DOV-SHP';
    v_product_names(37) := 'LEGO Classic Bricks'; v_product_descriptions(37) := 'Classic building brick set for creative construction play.'; v_product_prices(37) := 2999; v_product_skus(37) := 'TOYS-LEG-CLS';
    v_product_names(38) := 'Hot Wheels 5-Car Pack'; v_product_descriptions(38) := 'Set of five die-cast toy cars for children and collectors.'; v_product_prices(38) := 999; v_product_skus(38) := 'TOYS-HW-5PK';
    v_product_names(39) := 'Barbie Dreamhouse Doll'; v_product_descriptions(39) := 'Fashion doll with accessories for imaginative play.'; v_product_prices(39) := 2499; v_product_skus(39) := 'TOYS-BRB-DOL';
    v_product_names(40) := 'Monopoly Classic'; v_product_descriptions(40) := 'Classic family board game with property trading.'; v_product_prices(40) := 1999; v_product_skus(40) := 'TOYS-MON-CLS';
    v_product_names(41) := 'Rubik''s Cube 3x3'; v_product_descriptions(41) := 'Original-style 3x3 twist puzzle for all ages.'; v_product_prices(41) := 499; v_product_skus(41) := 'TOYS-RBK-3X3';
    v_product_names(42) := 'Nerf Elite Blaster'; v_product_descriptions(42) := 'Foam dart blaster designed for indoor and outdoor play.'; v_product_prices(42) := 1799; v_product_skus(42) := 'TOYS-NRF-ELT';
    v_product_names(43) := 'Classmate Notebook A5'; v_product_descriptions(43) := 'A5 ruled notebook for school, college and office notes.'; v_product_prices(43) := 99; v_product_skus(43) := 'OFFC-CLS-A5';
    v_product_names(44) := 'HP LaserJet Printer'; v_product_descriptions(44) := 'Monochrome laser printer for home and small-office printing.'; v_product_prices(44) := 12999; v_product_skus(44) := 'OFFC-HP-LJP';
    v_product_names(45) := 'Pilot V7 Roller Pen'; v_product_descriptions(45) := 'Smooth-writing liquid ink rollerball pen.'; v_product_prices(45) := 75; v_product_skus(45) := 'OFFC-PLT-V7';
    v_product_names(46) := 'Kangaro Stapler'; v_product_descriptions(46) := 'Compact office stapler with durable metal mechanism.'; v_product_prices(46) := 149; v_product_skus(46) := 'OFFC-KNG-STP';
    v_product_names(47) := 'Post-it Notes Pack'; v_product_descriptions(47) := 'Assorted adhesive notes for reminders and organization.'; v_product_prices(47) := 299; v_product_skus(47) := 'OFFC-PST-NTS';
    v_product_names(48) := 'Faber-Castell Highlighters'; v_product_descriptions(48) := 'Set of assorted-color highlighters for study and office use.'; v_product_prices(48) := 199; v_product_skus(48) := 'OFFC-FBC-HLT';
    v_product_names(49) := 'Nike Air Max 90'; v_product_descriptions(49) := 'Lifestyle sneakers with cushioned sole and classic styling.'; v_product_prices(49) := 8999; v_product_skus(49) := 'FOOT-NKE-AM90';
    v_product_names(50) := 'Adidas Grand Court'; v_product_descriptions(50) := 'Classic low-top sneakers for casual everyday wear.'; v_product_prices(50) := 5499; v_product_skus(50) := 'FOOT-ADI-GCT';
    v_product_names(51) := 'Puma Softride'; v_product_descriptions(51) := 'Comfort-focused running shoes with lightweight cushioning.'; v_product_prices(51) := 4999; v_product_skus(51) := 'FOOT-PMA-SFR';
    v_product_names(52) := 'Bata Formal Shoes'; v_product_descriptions(52) := 'Classic formal shoes for office wear.'; v_product_prices(52) := 2499; v_product_skus(52) := 'FOOT-BTA-FRM';
    v_product_names(53) := 'Skechers Go Walk'; v_product_descriptions(53) := 'Lightweight walking shoes with cushioned comfort.'; v_product_prices(53) := 6999; v_product_skus(53) := 'FOOT-SKW-WLK';
    v_product_names(54) := 'Woodland Casual Boots'; v_product_descriptions(54) := 'Durable outdoor-inspired boots for everyday wear.'; v_product_prices(54) := 5999; v_product_skus(54) := 'FOOT-WDL-BOT';
    v_product_names(55) := 'Fossil Analog Watch'; v_product_descriptions(55) := 'Stainless-steel analog watch with quartz movement.'; v_product_prices(55) := 10999; v_product_skus(55) := 'ACCS-FSL-WCH';
    v_product_names(56) := 'Ray-Ban Aviator Sunglasses'; v_product_descriptions(56) := 'Classic aviator sunglasses with UV-protective lenses.'; v_product_prices(56) := 7999; v_product_skus(56) := 'ACCS-RBN-AVI';
    v_product_names(57) := 'American Tourister Backpack'; v_product_descriptions(57) := 'Durable everyday backpack with padded laptop compartment.'; v_product_prices(57) := 2499; v_product_skus(57) := 'ACCS-AMT-BAG';
    v_product_names(58) := 'Boat Smartwatch'; v_product_descriptions(58) := 'Smartwatch with activity tracking and multiple watch faces.'; v_product_prices(58) := 1999; v_product_skus(58) := 'ACCS-BOA-SWT';
    v_product_names(59) := 'Wildcraft Wallet'; v_product_descriptions(59) := 'Compact bi-fold wallet with multiple card slots.'; v_product_prices(59) := 899; v_product_skus(59) := 'ACCS-WLD-WLT';
    v_product_names(60) := 'Portronics USB-C Hub'; v_product_descriptions(60) := 'Multi-port USB-C hub with HDMI and USB connectivity.'; v_product_prices(60) := 1499; v_product_skus(60) := 'ACCS-PRT-HUB';
    v_supplier_names(1) := 'Reliance Retail Supply';
    v_supplier_names(2) := 'Croma Distribution';
    v_supplier_names(3) := 'Metro Wholesale Traders';
    v_supplier_names(4) := 'Vijay Sales Distribution';
    v_supplier_names(5) := 'Shoppers Stop Supply';
    v_supplier_names(6) := 'Arvind Lifestyle Brands';
    v_supplier_names(7) := 'Future Consumer Supply';
    v_supplier_names(8) := 'Asian Paints Home Supply';
    v_supplier_names(9) := 'ITC Consumer Products';
    v_supplier_names(10) := 'Aditya Birla Retail Supply';
    v_supplier_names(11) := 'Decathlon India Supply';
    v_supplier_names(12) := 'Apollo Pharmacy Supply';
    v_supplier_names(13) := 'Himalaya Wellness Supply';
    v_supplier_names(14) := 'Shree Maruti Logistics';
    v_supplier_names(15) := 'Blue Dart Supply Chain';
    v_first_names(1) := 'Aarav';
    v_first_names(2) := 'Priya';
    v_first_names(3) := 'Rahul';
    v_first_names(4) := 'Ananya';
    v_first_names(5) := 'Arjun';
    v_first_names(6) := 'Diya';
    v_first_names(7) := 'Ishaan';
    v_first_names(8) := 'Meera';
    v_first_names(9) := 'Kabir';
    v_first_names(10) := 'Sana';
    v_first_names(11) := 'Vihaan';
    v_first_names(12) := 'Aisha';
    v_first_names(13) := 'Rohan';
    v_first_names(14) := 'Kavya';
    v_first_names(15) := 'Aditya';
    v_first_names(16) := 'Nisha';
    v_first_names(17) := 'Karan';
    v_first_names(18) := 'Ira';
    v_first_names(19) := 'Dev';
    v_first_names(20) := 'Tara';
    v_last_names(1) := 'Sharma';
    v_last_names(2) := 'Patel';
    v_last_names(3) := 'Reddy';
    v_last_names(4) := 'Nair';
    v_last_names(5) := 'Mehta';

SELECT COUNT(*) INTO v_existing_seed FROM PRODUCT WHERE sku = 'ELEC-IPH15-128';

IF v_existing_seed = 0 THEN
        -- Categories
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
SELECT COUNT(*) INTO v_existing_count FROM CATEGORY WHERE name = v_category_name;
IF v_existing_count = 0 THEN
                INSERT INTO CATEGORY (name, description)
                VALUES (v_category_name, v_category_name || ' products and essentials');
END IF;
END LOOP;

        -- Suppliers
FOR i IN 1..15 LOOP
SELECT COUNT(*) INTO v_existing_count FROM SUPPLIER WHERE name = v_supplier_names(i);
IF v_existing_count = 0 THEN
                INSERT INTO SUPPLIER (name, contact_email, phone, address)
                VALUES (
                    v_supplier_names(i),
                    'contact' || TO_CHAR(i, 'FM00') || '@example.com',
                    '9' || TO_CHAR(700000000 + i),
                    TO_CHAR(100 + i) || ' Industrial Area, ' ||
                    CASE MOD(i - 1, 5)
                        WHEN 0 THEN 'Mumbai' WHEN 1 THEN 'Delhi'
                        WHEN 2 THEN 'Bengaluru' WHEN 3 THEN 'Hyderabad'
                        ELSE 'Chennai'
                    END
                );
END IF;
END LOOP;

        -- Products and inventory
FOR i IN 1..60 LOOP
            v_category_name := CASE CEIL(i / 6)
                WHEN 1 THEN 'Electronics' WHEN 2 THEN 'Clothing'
                WHEN 3 THEN 'Home & Kitchen' WHEN 4 THEN 'Books'
                WHEN 5 THEN 'Sports & Outdoors' WHEN 6 THEN 'Beauty & Personal Care'
                WHEN 7 THEN 'Toys & Games' WHEN 8 THEN 'Office Supplies'
                WHEN 9 THEN 'Footwear' ELSE 'Accessories'
END;
SELECT category_id INTO v_category_id FROM CATEGORY WHERE name = v_category_name FETCH FIRST 1 ROW ONLY;
SELECT supplier_id INTO v_supplier_id FROM SUPPLIER WHERE name = v_supplier_names(MOD(i - 1, 15) + 1) FETCH FIRST 1 ROW ONLY;

INSERT INTO PRODUCT (category_id, supplier_id, name, description, price, sku, stock_quantity)
VALUES (v_category_id, v_supplier_id, v_product_names(i), v_product_descriptions(i), v_product_prices(i), v_product_skus(i), 500)
    RETURNING product_id INTO v_product_id;

INSERT INTO INVENTORY (product_id, warehouse_location, quantity_available)
VALUES (
           v_product_id,
           CASE MOD(i - 1, 5)
               WHEN 0 THEN 'Mumbai Fulfilment Centre'
               WHEN 1 THEN 'Delhi Distribution Centre'
               WHEN 2 THEN 'Bengaluru Distribution Centre'
               WHEN 3 THEN 'Hyderabad Distribution Centre'
               ELSE 'Chennai Fulfilment Centre'
               END,
           500
       );
END LOOP;

        -- Customers
FOR i IN 1..100 LOOP
            INSERT INTO CUSTOMER (
                first_name, last_name, email, phone, address, city, postal_code
            ) VALUES (
                v_first_names(MOD(i - 1, 20) + 1),
                v_last_names(FLOOR((i - 1) / 20) + 1),
                LOWER(v_first_names(MOD(i - 1, 20) + 1) || '.' ||
                      v_last_names(FLOOR((i - 1) / 20) + 1) ||
                      TO_CHAR(i, 'FM000')) || '@example.com',
                '91' || TO_CHAR(7000000000 + i),
                TO_CHAR(100 + i) || ' Market Road',
                CASE MOD(i - 1, 8)
                    WHEN 0 THEN 'Mumbai' WHEN 1 THEN 'Delhi'
                    WHEN 2 THEN 'Bengaluru' WHEN 3 THEN 'Hyderabad'
                    WHEN 4 THEN 'Chennai' WHEN 5 THEN 'Pune'
                    WHEN 6 THEN 'Kolkata' ELSE 'Visakhapatnam'
                END,
                TO_CHAR(400000 + MOD(i * 37, 59999))
            );
END LOOP;

        -- Orders, items and payments
FOR i IN 1..300 LOOP
SELECT customer_id INTO v_customer_id
FROM (
         SELECT customer_id, ROW_NUMBER() OVER (ORDER BY customer_id) rn
         FROM CUSTOMER
         WHERE email LIKE '%@example.com'
     )
WHERE rn = MOD(i - 1, 100) + 1;

v_order_status := CASE MOD(i - 1, 5)
                WHEN 0 THEN 'PENDING' WHEN 1 THEN 'CONFIRMED'
                WHEN 2 THEN 'SHIPPED' WHEN 3 THEN 'DELIVERED'
                ELSE 'CANCELLED'
END;

INSERT INTO ORDERS (customer_id, order_date, status, total_amount, shipping_address)
VALUES (
           v_customer_id,
           SYSTIMESTAMP - NUMTODSINTERVAL(MOD(i * 7, 180), 'DAY'),
           v_order_status,
           0,
           (SELECT address || ', ' || city FROM CUSTOMER WHERE customer_id = v_customer_id)
       ) RETURNING order_id INTO v_order_id;

SELECT product_id, price INTO v_product_id_1, v_price_1
FROM (
         SELECT product_id, price, ROW_NUMBER() OVER (ORDER BY product_id) rn
         FROM PRODUCT WHERE sku LIKE '%-%-%'
     )
WHERE rn = MOD((i * 2) - 2, 60) + 1;

SELECT product_id, price INTO v_product_id_2, v_price_2
FROM (
         SELECT product_id, price, ROW_NUMBER() OVER (ORDER BY product_id) rn
         FROM PRODUCT WHERE sku LIKE '%-%-%'
     )
WHERE rn = MOD((i * 2) - 1, 60) + 1;

INSERT INTO ORDER_ITEM (order_id, product_id, quantity, unit_price)
VALUES (v_order_id, v_product_id_1, 1 + MOD(i, 3), v_price_1);
INSERT INTO ORDER_ITEM (order_id, product_id, quantity, unit_price)
VALUES (v_order_id, v_product_id_2, 1 + MOD(i + 1, 2), v_price_2);

SELECT SUM(quantity * unit_price) INTO v_total FROM ORDER_ITEM WHERE order_id = v_order_id;
UPDATE ORDERS SET total_amount = v_total WHERE order_id = v_order_id;

v_payment_method := CASE MOD(i - 1, 5)
                WHEN 0 THEN 'UPI' WHEN 1 THEN 'CREDIT_CARD'
                WHEN 2 THEN 'DEBIT_CARD' WHEN 3 THEN 'NET_BANKING'
                ELSE 'COD'
END;
            v_payment_status := CASE v_order_status
                WHEN 'PENDING' THEN 'PENDING'
                WHEN 'CANCELLED' THEN 'REFUNDED'
                ELSE 'COMPLETED'
END;

INSERT INTO PAYMENT (order_id, payment_method, amount, payment_status, transaction_date)
VALUES (
           v_order_id, v_payment_method, v_total, v_payment_status,
           SYSTIMESTAMP - NUMTODSINTERVAL(MOD(i * 5, 180), 'DAY')
       );
END LOOP;

COMMIT;
DBMS_OUTPUT.PUT_LINE('Realistic seed data created: 10 categories, 15 suppliers, 60 products, 100 customers, 300 orders, 600 items, 300 payments.');
ELSE
        DBMS_OUTPUT.PUT_LINE('Seed skipped: realistic catalogue already exists.');
END IF;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;