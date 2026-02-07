-- Update profile timestamps with progressive growth from November 2025 to February 7, 2026
-- Earlier users (1-30) created in November 2025
-- Mid users (31-60) created in December 2025
-- Later users (61-85) created in January 2026
-- Recent users (86-100) created in February 2026

-- November 2025 users (1-30) - Early adopters
UPDATE profiles SET created_at = '2025-11-02 09:15:00+00' WHERE slug = 'sanitex';
UPDATE profiles SET created_at = '2025-11-03 14:30:00+00' WHERE slug = 'bello-textiles';
UPDATE profiles SET created_at = '2025-11-05 11:45:00+00' WHERE slug = 'bashir-weaves';
UPDATE profiles SET created_at = '2025-11-07 16:20:00+00' WHERE slug = 'usman-fabrics';
UPDATE profiles SET created_at = '2025-11-09 08:55:00+00' WHERE slug = 'umarah-textiles';
UPDATE profiles SET created_at = '2025-11-11 13:10:00+00' WHERE slug = 'mansur-tex';
UPDATE profiles SET created_at = '2025-11-13 10:25:00+00' WHERE slug = 'musa-weaves';
UPDATE profiles SET created_at = '2025-11-15 15:40:00+00' WHERE slug = 'idris-textiles';
UPDATE profiles SET created_at = '2025-11-17 12:05:00+00' WHERE slug = 'kabiru-fabrics';
UPDATE profiles SET created_at = '2025-11-19 17:30:00+00' WHERE slug = 'hamza-tex';
UPDATE profiles SET created_at = '2025-11-20 09:45:00+00' WHERE slug = 'suleiman-textiles';
UPDATE profiles SET created_at = '2025-11-21 14:00:00+00' WHERE slug = 'ali-weaves';
UPDATE profiles SET created_at = '2025-11-22 11:15:00+00' WHERE slug = 'mahmud-fabrics';
UPDATE profiles SET created_at = '2025-11-23 16:30:00+00' WHERE slug = 'isa-textiles';
UPDATE profiles SET created_at = '2025-11-24 08:45:00+00' WHERE slug = 'jibril-tex';
UPDATE profiles SET created_at = '2025-11-25 13:00:00+00' WHERE slug = 'yusuf-weaves';
UPDATE profiles SET created_at = '2025-11-26 10:15:00+00' WHERE slug = 'zakari-textiles';
UPDATE profiles SET created_at = '2025-11-27 15:30:00+00' WHERE slug = 'ismaeel-fabrics';
UPDATE profiles SET created_at = '2025-11-28 12:45:00+00' WHERE slug = 'hassan-tex';
UPDATE profiles SET created_at = '2025-11-29 17:00:00+00' WHERE slug = 'hussaini-textiles';
UPDATE profiles SET created_at = '2025-11-30 09:15:00+00' WHERE slug = 'abubakar-weaves';

-- December 2025 users (22-55) - Growing adoption
UPDATE profiles SET created_at = '2025-12-01 14:30:00+00' WHERE slug = 'sani-fabrics';
UPDATE profiles SET created_at = '2025-12-02 11:45:00+00' WHERE slug = 'bashir-tex';
UPDATE profiles SET created_at = '2025-12-03 16:00:00+00' WHERE slug = 'ibrahim-textiles';
UPDATE profiles SET created_at = '2025-12-04 08:15:00+00' WHERE slug = 'umar-fabrics';
UPDATE profiles SET created_at = '2025-12-05 13:30:00+00' WHERE slug = 'musa-tex';
UPDATE profiles SET created_at = '2025-12-06 10:45:00+00' WHERE slug = 'ahmad-textiles';
UPDATE profiles SET created_at = '2025-12-07 15:00:00+00' WHERE slug = 'hamza-weaves';
UPDATE profiles SET created_at = '2025-12-08 12:15:00+00' WHERE slug = 'yusuf-textiles';
UPDATE profiles SET created_at = '2025-12-09 17:30:00+00' WHERE slug = 'mustapha-fabrics';
UPDATE profiles SET created_at = '2025-12-10 09:45:00+00' WHERE slug = 'jibril-textiles';
UPDATE profiles SET created_at = '2025-12-11 14:00:00+00' WHERE slug = 'yahaya-tex';
UPDATE profiles SET created_at = '2025-12-12 11:15:00+00' WHERE slug = 'idris-fabrics';
UPDATE profiles SET created_at = '2025-12-13 16:30:00+00' WHERE slug = 'yerima-textiles';
UPDATE profiles SET created_at = '2025-12-14 08:45:00+00' WHERE slug = 'laraba-weaves';
UPDATE profiles SET created_at = '2025-12-15 13:00:00+00' WHERE slug = 'danjuma-tex';
UPDATE profiles SET created_at = '2025-12-16 10:15:00+00' WHERE slug = 'ramatu-fabrics';
UPDATE profiles SET created_at = '2025-12-17 15:30:00+00' WHERE slug = 'suleiman-weaves';
UPDATE profiles SET created_at = '2025-12-18 12:45:00+00' WHERE slug = 'aminu-textiles';
UPDATE profiles SET created_at = '2025-12-19 17:00:00+00' WHERE slug = 'talatu-tex';
UPDATE profiles SET created_at = '2025-12-20 09:15:00+00' WHERE slug = 'malam-aminu-fabrics';
UPDATE profiles SET created_at = '2025-12-21 14:30:00+00' WHERE slug = 'yerima-abubakar-tex';
UPDATE profiles SET created_at = '2025-12-22 11:45:00+00' WHERE slug = 'gimbiya-textiles';
UPDATE profiles SET created_at = '2025-12-23 16:00:00+00' WHERE slug = 'sarki-bello-fabrics';
UPDATE profiles SET created_at = '2025-12-24 08:15:00+00' WHERE slug = 'waziri-textiles';
UPDATE profiles SET created_at = '2025-12-25 13:30:00+00' WHERE slug = 'garkuwa-tex';
UPDATE profiles SET created_at = '2025-12-26 10:45:00+00' WHERE slug = 'maina-weaves';
UPDATE profiles SET created_at = '2025-12-27 15:00:00+00' WHERE slug = 'shehu-usman-textiles';
UPDATE profiles SET created_at = '2025-12-28 12:15:00+00' WHERE slug = 'mariya-textiles';
UPDATE profiles SET created_at = '2025-12-29 17:30:00+00' WHERE slug = 'sarauniya-fabrics';
UPDATE profiles SET created_at = '2025-12-30 09:45:00+00' WHERE slug = 'bappa-idris-textiles';
UPDATE profiles SET created_at = '2025-12-31 14:00:00+00' WHERE slug = 'hajia-hadiza-fabrics';

-- January 2026 users (56-85) - Accelerated growth
UPDATE profiles SET created_at = '2026-01-02 11:15:00+00' WHERE slug = 'dan-tata-kabiru-tex';
UPDATE profiles SET created_at = '2026-01-03 16:30:00+00' WHERE slug = 'nagari-bashir-textiles';
UPDATE profiles SET created_at = '2026-01-04 08:45:00+00' WHERE slug = 'turaki-nasiru-fabrics';
UPDATE profiles SET created_at = '2026-01-05 13:00:00+00' WHERE slug = 'malam-ismail-textiles';
UPDATE profiles SET created_at = '2026-01-06 10:15:00+00' WHERE slug = 'gimbiya-zainab-tex';
UPDATE profiles SET created_at = '2026-01-07 15:30:00+00' WHERE slug = 'yerima-umar-fabrics';
UPDATE profiles SET created_at = '2026-01-08 12:45:00+00' WHERE slug = 'waziri-faruk-textiles';
UPDATE profiles SET created_at = '2026-01-09 17:00:00+00' WHERE slug = 'sarki-hamza-tex';
UPDATE profiles SET created_at = '2026-01-10 09:15:00+00' WHERE slug = 'kano-abubakar-textiles';
UPDATE profiles SET created_at = '2026-01-11 14:30:00+00' WHERE slug = 'kaduna-sani-fabrics';
UPDATE profiles SET created_at = '2026-01-12 11:45:00+00' WHERE slug = 'sokoto-fatima-textiles';
UPDATE profiles SET created_at = '2026-01-13 16:00:00+00' WHERE slug = 'katsina-umar-tex';
UPDATE profiles SET created_at = '2026-01-14 08:15:00+00' WHERE slug = 'bauchi-musa-fabrics';
UPDATE profiles SET created_at = '2026-01-15 13:30:00+00' WHERE slug = 'zaria-ahmad-textiles';
UPDATE profiles SET created_at = '2026-01-16 10:45:00+00' WHERE slug = 'daura-zainab-tex';
UPDATE profiles SET created_at = '2026-01-17 15:00:00+00' WHERE slug = 'gumel-bashir-fabrics';
UPDATE profiles SET created_at = '2026-01-18 12:15:00+00' WHERE slug = 'hadejia-hauwa-textiles';
UPDATE profiles SET created_at = '2026-01-19 17:30:00+00' WHERE slug = 'birnin-nasiru-tex';
UPDATE profiles SET created_at = '2026-01-20 09:45:00+00' WHERE slug = 'kazaure-jibril-fabrics';
UPDATE profiles SET created_at = '2026-01-21 14:00:00+00' WHERE slug = 'yobe-bello-textiles';
UPDATE profiles SET created_at = '2026-01-22 11:15:00+00' WHERE slug = 'dutse-aminu-tex';
UPDATE profiles SET created_at = '2026-01-23 16:30:00+00' WHERE slug = 'kura-idris-fabrics';
UPDATE profiles SET created_at = '2026-01-24 08:45:00+00' WHERE slug = 'maradi-hadiza-textiles';
UPDATE profiles SET created_at = '2026-01-25 13:00:00+00' WHERE slug = 'bichi-usman-tex';
UPDATE profiles SET created_at = '2026-01-26 10:15:00+00' WHERE slug = 'minna-suleiman-fabrics';
UPDATE profiles SET created_at = '2026-01-27 15:30:00+00' WHERE slug = 'rano-kabiru-textiles';
UPDATE profiles SET created_at = '2026-01-28 12:45:00+00' WHERE slug = 'zinder-maryam-tex';
UPDATE profiles SET created_at = '2026-01-29 17:00:00+00' WHERE slug = 'kebbi-faruk-fabrics';
UPDATE profiles SET created_at = '2026-01-30 09:15:00+00' WHERE slug = 'abubakar-classic-textiles';
UPDATE profiles SET created_at = '2026-01-31 14:30:00+00' WHERE slug = 'fatima-modern-fabrics';

-- February 2026 users (86-100) - Recent signups
UPDATE profiles SET created_at = '2026-02-01 11:45:00+00' WHERE slug = 'sani-prime-textiles';
UPDATE profiles SET created_at = '2026-02-02 16:00:00+00' WHERE slug = 'zainab-looms';
UPDATE profiles SET created_at = '2026-02-03 08:15:00+00' WHERE slug = 'umar-musa-fabrics';
UPDATE profiles SET created_at = '2026-02-03 13:30:00+00' WHERE slug = 'hauwa-textiles';
UPDATE profiles SET created_at = '2026-02-04 10:45:00+00' WHERE slug = 'ibrahim-k-fabrics';
UPDATE profiles SET created_at = '2026-02-04 15:00:00+00' WHERE slug = 'nasiru-j-tex';
UPDATE profiles SET created_at = '2026-02-05 12:15:00+00' WHERE slug = 'khadija-weaves';
UPDATE profiles SET created_at = '2026-02-05 17:30:00+00' WHERE slug = 'yusuf-m-textiles';
UPDATE profiles SET created_at = '2026-02-06 09:45:00+00' WHERE slug = 'bashira-fabrics';
UPDATE profiles SET created_at = '2026-02-06 14:00:00+00' WHERE slug = 'maryam-u-textiles';
UPDATE profiles SET created_at = '2026-02-06 16:15:00+00' WHERE slug = 'hamza-s-tex';
UPDATE profiles SET created_at = '2026-02-07 08:30:00+00' WHERE slug = 'mustapha-t-fabrics';
UPDATE profiles SET created_at = '2026-02-07 09:45:00+00' WHERE slug = 'halima-z-textiles';
UPDATE profiles SET created_at = '2026-02-07 10:00:00+00' WHERE slug = 'yahaya-n-tex';
UPDATE profiles SET created_at = '2026-02-07 10:15:00+00' WHERE slug = 'aminu-d-fabrics';

-- Update subscription timestamps to show conversion pattern
-- Early November adopters converted to paid quickly
UPDATE subscriptions SET 
  created_at = '2025-11-05 10:00:00+00',
  next_payment_date = '2026-02-05 10:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'sanitex');

UPDATE subscriptions SET 
  created_at = '2025-11-06 11:00:00+00',
  next_payment_date = '2026-02-06 11:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'bello-textiles');

UPDATE subscriptions SET 
  created_at = '2025-11-08 14:00:00+00',
  next_payment_date = '2026-02-08 14:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'bashir-weaves');

UPDATE subscriptions SET 
  created_at = '2025-11-10 09:30:00+00',
  next_payment_date = '2026-02-10 09:30:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'usman-fabrics');

UPDATE subscriptions SET 
  created_at = '2025-11-12 16:00:00+00',
  next_payment_date = '2026-02-12 16:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'umarah-textiles');

UPDATE subscriptions SET 
  created_at = '2025-11-14 11:30:00+00',
  next_payment_date = '2026-02-14 11:30:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'mansur-tex');

UPDATE subscriptions SET 
  created_at = '2025-11-16 14:00:00+00',
  next_payment_date = '2026-02-16 14:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'musa-weaves');

UPDATE subscriptions SET 
  created_at = '2025-11-18 10:00:00+00',
  next_payment_date = '2026-02-18 10:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'idris-textiles');

UPDATE subscriptions SET 
  created_at = '2025-11-20 15:00:00+00',
  next_payment_date = '2026-02-20 15:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'kabiru-fabrics');

UPDATE subscriptions SET 
  created_at = '2025-11-22 12:00:00+00',
  next_payment_date = '2026-02-22 12:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'hamza-tex');

-- Mid-November to December conversions (more spread out)
UPDATE subscriptions SET 
  created_at = '2025-11-25 09:00:00+00',
  next_payment_date = '2026-02-25 09:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'suleiman-textiles');

UPDATE subscriptions SET 
  created_at = '2025-11-28 14:30:00+00',
  next_payment_date = '2026-02-28 14:30:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'ali-weaves');

UPDATE subscriptions SET 
  created_at = '2025-12-01 11:00:00+00',
  next_payment_date = '2026-03-01 11:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'mahmud-fabrics');

UPDATE subscriptions SET 
  created_at = '2025-12-03 16:00:00+00',
  next_payment_date = '2026-03-03 16:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'isa-textiles');

UPDATE subscriptions SET 
  created_at = '2025-12-05 10:30:00+00',
  next_payment_date = '2026-03-05 10:30:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'jibril-tex');

UPDATE subscriptions SET 
  created_at = '2025-12-07 13:00:00+00',
  next_payment_date = '2026-03-07 13:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'yusuf-weaves');

UPDATE subscriptions SET 
  created_at = '2025-12-09 09:30:00+00',
  next_payment_date = '2026-03-09 09:30:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'zakari-textiles');

UPDATE subscriptions SET 
  created_at = '2025-12-11 15:00:00+00',
  next_payment_date = '2026-03-11 15:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'ismaeel-fabrics');

UPDATE subscriptions SET 
  created_at = '2025-12-13 12:00:00+00',
  next_payment_date = '2026-03-13 12:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'hassan-tex');

UPDATE subscriptions SET 
  created_at = '2025-12-15 10:00:00+00',
  next_payment_date = '2026-03-15 10:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'hussaini-textiles');

-- December conversions (holiday boost)
UPDATE subscriptions SET 
  created_at = '2025-12-17 14:00:00+00',
  next_payment_date = '2026-03-17 14:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'abubakar-weaves');

UPDATE subscriptions SET 
  created_at = '2025-12-18 11:00:00+00',
  next_payment_date = '2026-03-18 11:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'sani-fabrics');

UPDATE subscriptions SET 
  created_at = '2025-12-19 16:00:00+00',
  next_payment_date = '2026-03-19 16:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'bashir-tex');

UPDATE subscriptions SET 
  created_at = '2025-12-20 09:00:00+00',
  next_payment_date = '2026-03-20 09:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'ibrahim-textiles');

UPDATE subscriptions SET 
  created_at = '2025-12-21 13:30:00+00',
  next_payment_date = '2026-03-21 13:30:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'umar-fabrics');

UPDATE subscriptions SET 
  created_at = '2025-12-22 10:00:00+00',
  next_payment_date = '2026-03-22 10:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'musa-tex');

UPDATE subscriptions SET 
  created_at = '2025-12-23 15:00:00+00',
  next_payment_date = '2026-03-23 15:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'ahmad-textiles');

UPDATE subscriptions SET 
  created_at = '2025-12-24 12:00:00+00',
  next_payment_date = '2026-03-24 12:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'hamza-weaves');

UPDATE subscriptions SET 
  created_at = '2025-12-26 09:00:00+00',
  next_payment_date = '2026-03-26 09:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'yusuf-textiles');

UPDATE subscriptions SET 
  created_at = '2025-12-27 14:00:00+00',
  next_payment_date = '2026-03-27 14:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'mustapha-fabrics');

-- January 2026 conversions (New Year momentum)
UPDATE subscriptions SET 
  created_at = '2026-01-02 11:00:00+00',
  next_payment_date = '2026-04-02 11:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'jibril-textiles');

UPDATE subscriptions SET 
  created_at = '2026-01-04 16:00:00+00',
  next_payment_date = '2026-04-04 16:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'yahaya-tex');

UPDATE subscriptions SET 
  created_at = '2026-01-06 10:00:00+00',
  next_payment_date = '2026-04-06 10:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'idris-fabrics');

UPDATE subscriptions SET 
  created_at = '2026-01-08 13:00:00+00',
  next_payment_date = '2026-04-08 13:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'yerima-textiles');

UPDATE subscriptions SET 
  created_at = '2026-01-10 09:30:00+00',
  next_payment_date = '2026-04-10 09:30:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'laraba-weaves');

UPDATE subscriptions SET 
  created_at = '2026-01-12 15:00:00+00',
  next_payment_date = '2026-04-12 15:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'danjuma-tex');

UPDATE subscriptions SET 
  created_at = '2026-01-14 12:00:00+00',
  next_payment_date = '2026-04-14 12:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'ramatu-fabrics');

UPDATE subscriptions SET 
  created_at = '2026-01-16 10:00:00+00',
  next_payment_date = '2026-04-16 10:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'suleiman-weaves');

UPDATE subscriptions SET 
  created_at = '2026-01-18 14:00:00+00',
  next_payment_date = '2026-04-18 14:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'aminu-textiles');

UPDATE subscriptions SET 
  created_at = '2026-01-20 11:00:00+00',
  next_payment_date = '2026-04-20 11:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'talatu-tex');

-- Late January / Early February conversions (recent)
UPDATE subscriptions SET 
  created_at = '2026-01-22 16:00:00+00',
  next_payment_date = '2026-04-22 16:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'malam-aminu-fabrics');

UPDATE subscriptions SET 
  created_at = '2026-01-24 09:00:00+00',
  next_payment_date = '2026-04-24 09:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'yerima-abubakar-tex');

UPDATE subscriptions SET 
  created_at = '2026-01-26 13:00:00+00',
  next_payment_date = '2026-04-26 13:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'gimbiya-textiles');

UPDATE subscriptions SET 
  created_at = '2026-01-28 10:00:00+00',
  next_payment_date = '2026-04-28 10:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'sarki-bello-fabrics');

UPDATE subscriptions SET 
  created_at = '2026-01-30 15:00:00+00',
  next_payment_date = '2026-04-30 15:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'waziri-textiles');

UPDATE subscriptions SET 
  created_at = '2026-02-01 12:00:00+00',
  next_payment_date = '2026-05-01 12:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'garkuwa-tex');

UPDATE subscriptions SET 
  created_at = '2026-02-03 09:00:00+00',
  next_payment_date = '2026-05-03 09:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'maina-weaves');

UPDATE subscriptions SET 
  created_at = '2026-02-05 14:00:00+00',
  next_payment_date = '2026-05-05 14:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'shehu-usman-textiles');

UPDATE subscriptions SET 
  created_at = '2026-02-06 11:00:00+00',
  next_payment_date = '2026-05-06 11:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'mariya-textiles');

UPDATE subscriptions SET 
  created_at = '2026-02-07 08:00:00+00',
  next_payment_date = '2026-05-07 08:00:00+00'
WHERE profile_id = (SELECT id FROM profiles WHERE slug = 'sarauniya-fabrics');