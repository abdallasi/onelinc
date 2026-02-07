-- Add 10-15 products (cards) to each of the 50 paid users
-- Add 0-4 products to free users
-- cta_type must be 'product', 'link', or 'work'

-- Create products for all paid user slugs (10-15 products each)
DO $$
DECLARE
    paid_slugs text[] := ARRAY[
        'sanitex', 'bello-textiles', 'bashir-weaves', 'usman-fabrics', 'umarah-textiles', 
        'mansur-tex', 'musa-weaves', 'idris-textiles', 'kabiru-fabrics', 'hamza-tex', 
        'suleiman-textiles', 'ali-weaves', 'mahmud-fabrics', 'isa-textiles', 'jibril-tex', 
        'yusuf-weaves', 'zakari-textiles', 'ismaeel-fabrics', 'hassan-tex', 'hussaini-textiles', 
        'abubakar-weaves', 'sani-fabrics', 'bashir-tex', 'ibrahim-textiles', 'umar-fabrics', 
        'musa-tex', 'ahmad-textiles', 'hamza-weaves', 'yusuf-textiles', 'mustapha-fabrics', 
        'jibril-textiles', 'yahaya-tex', 'idris-fabrics', 'yerima-textiles', 'laraba-weaves', 
        'danjuma-tex', 'ramatu-fabrics', 'suleiman-weaves', 'aminu-textiles', 'talatu-tex', 
        'malam-aminu-fabrics', 'yerima-abubakar-tex', 'gimbiya-textiles', 'sarki-bello-fabrics', 
        'waziri-textiles', 'garkuwa-tex', 'maina-weaves', 'shehu-usman-textiles', 
        'mariya-textiles', 'sarauniya-fabrics'
    ];
    product_names text[] := ARRAY[
        'Ankara Premium', 'Lace Material', 'Cotton Fabric', 'Velvet Cloth', 'Silk Material',
        'Adire Fabric', 'Guinea Brocade', 'Atiku Material', 'Voile Fabric', 'Jacquard Material',
        'Kente Cloth', 'Damask Fabric', 'French Lace', 'Chiffon Material', 'Satin Fabric'
    ];
    prices text[] := ARRAY['₦3,500', '₦4,500', '₦5,500', '₦6,500', '₦7,500', '₦8,500', '₦9,500', '₦12,000', '₦15,000', '₦18,000', '₦20,000', '₦25,000', '₦30,000', '₦35,000', '₦40,000'];
    s text;
    profile_rec record;
    num_products int;
    i int;
BEGIN
    FOREACH s IN ARRAY paid_slugs LOOP
        SELECT id, created_at INTO profile_rec FROM profiles WHERE slug = s;
        IF profile_rec.id IS NOT NULL THEN
            num_products := 10 + floor(random() * 6)::int; -- 10-15 products
            FOR i IN 1..num_products LOOP
                INSERT INTO cards (profile_id, title, description, price, cta_type, order_index, created_at)
                VALUES (
                    profile_rec.id,
                    product_names[1 + ((i-1) % array_length(product_names, 1))],
                    'Quality textile material',
                    prices[1 + ((i-1) % array_length(prices, 1))],
                    'product',
                    i,
                    profile_rec.created_at + (i * interval '1 hour')
                )
                ON CONFLICT DO NOTHING;
            END LOOP;
        END IF;
    END LOOP;
END $$;

-- Create products for free users (0-4 products each)
DO $$
DECLARE
    free_slugs text[] := ARRAY[
        'bappa-idris-textiles', 'hajia-hadiza-fabrics', 'dan-tata-kabiru-tex', 'nagari-bashir-textiles',
        'turaki-nasiru-fabrics', 'malam-ismail-textiles', 'gimbiya-zainab-tex', 'yerima-umar-fabrics',
        'waziri-faruk-textiles', 'sarki-hamza-tex', 'kano-abubakar-textiles', 'kaduna-sani-fabrics',
        'sokoto-fatima-textiles', 'katsina-umar-tex', 'bauchi-musa-fabrics', 'zaria-ahmad-textiles',
        'daura-zainab-tex', 'gumel-bashir-fabrics', 'hadejia-hauwa-textiles', 'birnin-nasiru-tex',
        'kazaure-jibril-fabrics', 'yobe-bello-textiles', 'dutse-aminu-tex', 'kura-idris-fabrics',
        'maradi-hadiza-textiles', 'bichi-usman-tex', 'minna-suleiman-fabrics', 'rano-kabiru-textiles',
        'zinder-maryam-tex', 'kebbi-faruk-fabrics', 'abubakar-classic-textiles', 'fatima-modern-fabrics',
        'sani-prime-textiles', 'zainab-looms', 'umar-musa-fabrics', 'hauwa-textiles',
        'ibrahim-k-fabrics', 'nasiru-j-tex', 'khadija-weaves', 'yusuf-m-textiles',
        'bashira-fabrics', 'maryam-u-textiles', 'hamza-s-tex', 'mustapha-t-fabrics',
        'halima-z-textiles', 'yahaya-n-tex', 'aminu-d-fabrics', 'sadiya-m-textiles',
        'faruk-b-tex', 'shehu-a-fabrics'
    ];
    product_names text[] := ARRAY['Ankara Basic', 'Cotton Material', 'Lace Fabric', 'Adire Cloth'];
    prices text[] := ARRAY['₦2,500', '₦3,500', '₦4,500', '₦5,500'];
    s text;
    profile_rec record;
    num_products int;
    i int;
BEGIN
    FOREACH s IN ARRAY free_slugs LOOP
        SELECT id, created_at INTO profile_rec FROM profiles WHERE slug = s;
        IF profile_rec.id IS NOT NULL THEN
            num_products := floor(random() * 5)::int; -- 0-4 products
            IF num_products > 0 THEN
                FOR i IN 1..num_products LOOP
                    INSERT INTO cards (profile_id, title, description, price, cta_type, order_index, created_at)
                    VALUES (
                        profile_rec.id,
                        product_names[1 + ((i-1) % array_length(product_names, 1))],
                        'Quality textile material',
                        prices[1 + ((i-1) % array_length(prices, 1))],
                        'product',
                        i,
                        profile_rec.created_at + (i * interval '2 hours')
                    )
                    ON CONFLICT DO NOTHING;
                END LOOP;
            END IF;
        END IF;
    END LOOP;
END $$;