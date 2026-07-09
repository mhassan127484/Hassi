-- Seed data generated from the original mock catalog. Safe to edit or delete rows afterward via the admin panel.

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('phantom-overcoat', 'Phantom Overcoat', 'Hassi Atelier', 24900, 29900, 'Outerwear', ARRAY['S','M','L','XL']::text[], 6, 4.8, 46, 'Vol. 01', 'A single-breasted overcoat cut from double-face wool. Dropped shoulder, concealed placket, and a hem that moves with you.', ARRAY['80% wool, 20% nylon double-face','Dropped shoulder, relaxed silhouette','Concealed placket, horn-effect buttons','Interior phone pocket']::text[], '{"Material":"Double-face wool, garment finished","Fit":"Relaxed, true to size","Care":"Dry clean only","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['bestseller']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Ink / Cobalt', '#111114', 0),
  ('Bone', '#E4E7F5', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('atlas-knit', 'Atlas Ribbed Knit', 'Hassi Standard', 8900, null, 'Knitwear', ARRAY['XS','S','M','L','XL']::text[], 14, 4.6, 61, 'Vol. 01', 'Chunky merino rib with a relaxed body. The kind of layer you reach for before you think about it.', ARRAY['100% merino wool','Chunky rib knit','Relaxed body, dropped shoulder','Ribbed cuffs and hem']::text[], '{"Material":"100% merino wool","Fit":"Relaxed, size down for fitted","Care":"Hand wash cold, dry flat","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['bestseller','new']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Bone', '#E4E7F5', 0),
  ('Ink', '#111114', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('meridian-denim', 'Meridian Wide Denim', 'Hassi Standard', 11500, null, 'Denim', ARRAY['28','30','32','34','36']::text[], 9, 4.7, 38, 'Vol. 01', 'Raw selvedge denim with a wide, architectural leg. Fades into something personal over time.', ARRAY['13oz raw selvedge denim','Wide, architectural leg','Button-fly, self-fabric belt loops','Unwashed - fades with wear']::text[], '{"Material":"100% cotton selvedge denim","Fit":"Wide leg, true to size","Care":"Wash cold, hang dry","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['bestseller']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Raw Indigo', '#1c2b6b', 0),
  ('Charcoal', '#2A2A30', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('null-scarf', 'Null Wool Scarf', 'Hassi Studio', 4200, null, 'Accessories', ARRAY['One Size']::text[], 22, 4.5, 29, 'Vol. 01', 'An oversized brushed-wool scarf. Wraps twice, warms always.', ARRAY['100% brushed wool','180 x 40cm','Fringed edges','Wraps twice around the neck']::text[], '{"Material":"100% brushed wool","Fit":"One size","Care":"Dry clean only","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY[]::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Stone', '#8A8681', 0),
  ('Ink', '#111114', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('vector-bomber', 'Vector Bomber', 'Hassi Atelier', 18900, null, 'Outerwear', ARRAY['XS','S','M','L','XL']::text[], 3, 4.9, 52, 'Vol. 01', 'A cropped technical bomber with a matte shell and ribbed cuffs. Weightless, wind-blocking.', ARRAY['Matte technical shell','Taped seams, wind-blocking','Ribbed collar, cuffs and hem','Zippered chest pocket']::text[], '{"Material":"Recycled nylon shell, fleece lining","Fit":"Cropped, true to size","Care":"Machine wash cold","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['bestseller','low-stock']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Cobalt', '#2B4CF0', 0),
  ('Ink', '#111114', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('quiet-hoodie', 'Quiet Heavy Hoodie', 'Hassi Standard', 7600, null, 'Knitwear', ARRAY['XS','S','M','L','XL','XXL']::text[], 18, 4.7, 74, 'Vol. 01', '500gsm loopback cotton, boxy fit, garment-dyed. The last hoodie argument you''ll have.', ARRAY['500gsm loopback cotton','Boxy, dropped-shoulder fit','Garment-dyed for depth of color','Kangaroo pocket']::text[], '{"Material":"100% loopback cotton","Fit":"Boxy, size down for fitted","Care":"Machine wash cold, inside out","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['new']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Ink', '#111114', 0),
  ('Bone', '#E4E7F5', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('orbit-tote', 'Orbit Leather Tote', 'Hassi Studio', 13400, null, 'Bags', ARRAY['One Size']::text[], 11, 4.6, 33, 'Vol. 01', 'Vegetable-tanned leather that softens with the week. Holds a laptop and a mood.', ARRAY['Vegetable-tanned leather','Fits a 15" laptop','Interior zip pocket','Softens and patinas with wear']::text[], '{"Material":"Full-grain vegetable-tanned leather","Fit":"38 x 32 x 12cm","Care":"Wipe clean, leather conditioner as needed","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY[]::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Bone', '#F2EEE6', 0),
  ('Clay', '#C9C2B4', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('static-trouser', 'Static Pleated Trouser', 'Hassi Standard', 9800, null, 'Denim', ARRAY['28','30','32','34','36']::text[], 8, 4.4, 21, 'Vol. 01', 'A single-pleat wool-blend trouser with a clean break. Sharp without trying.', ARRAY['Wool-blend twill','Single pleat, tapered leg','Clean break at the ankle','Side-adjuster waistband']::text[], '{"Material":"70% wool, 30% polyester","Fit":"Tapered, true to size","Care":"Dry clean only","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY[]::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Charcoal', '#2A2A30', 0),
  ('Sand', '#E8E2D9', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('field-parka', 'Field Parka', 'Hassi Atelier', 27500, null, 'Outerwear', ARRAY['S','M','L','XL']::text[], 5, 4.8, 17, 'Vol. 02', 'A long-line field parka with a storm flap and removable liner. Built for the season, not just the shoot.', ARRAY['Waxed cotton shell','Removable quilted liner','Storm flap over front zip','Four-pocket utility front']::text[], '{"Material":"Waxed cotton, quilted polyester liner","Fit":"Long-line, true to size","Care":"Spot clean, re-wax annually","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['new']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Moss', '#525F45', 0),
  ('Ink', '#111114', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('cursive-cardigan', 'Cursive Cardigan', 'Hassi Standard', 10200, null, 'Knitwear', ARRAY['XS','S','M','L']::text[], 12, 4.5, 24, 'Vol. 02', 'A fine-gauge cardigan with horn buttons and a soft drape. Layers under everything, over nothing.', ARRAY['Fine-gauge cotton-wool blend','Horn-effect button front','Ribbed collar and cuffs','Soft, fluid drape']::text[], '{"Material":"60% cotton, 40% wool","Fit":"Relaxed, true to size","Care":"Hand wash cold","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['new']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Clay', '#C9C2B4', 0),
  ('Ink', '#111114', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('raw-slim-denim', 'Raw Slim Denim', 'Hassi Standard', 10800, null, 'Denim', ARRAY['28','30','32','34','36','38']::text[], 16, 4.6, 42, 'Vol. 01', 'A slim straight cut in rigid 12oz denim. The everyday pair, done properly.', ARRAY['12oz rigid selvedge denim','Slim straight leg','Five-pocket construction','Unwashed - fades with wear']::text[], '{"Material":"100% cotton selvedge denim","Fit":"Slim, true to size","Care":"Wash cold, hang dry","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY[]::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Raw Indigo', '#1c2b6b', 0),
  ('Black', '#111114', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('monolith-crossbody', 'Monolith Crossbody', 'Hassi Studio', 6900, null, 'Bags', ARRAY['One Size']::text[], 20, 4.3, 19, 'Vol. 02', 'A minimal crossbody in structured canvas with leather trim. Fits the essentials, nothing more.', ARRAY['Water-resistant structured canvas','Leather trim and strap','Fits phone, cards, keys','Adjustable strap, 55-120cm']::text[], '{"Material":"Canvas body, leather trim","Fit":"18 x 14 x 5cm","Care":"Wipe clean","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['new']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Ink', '#111114', 0),
  ('Rust', '#B5502D', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('form-sneaker', 'Form Low Sneaker', 'Hassi Studio', 12500, null, 'Footwear', ARRAY['39','40','41','42','43','44']::text[], 10, 4.7, 58, 'Vol. 02', 'A low-profile sneaker in brushed leather with a moulded rubber sole. Quiet, considered, all-day.', ARRAY['Brushed full-grain leather upper','Moulded rubber outsole','Padded collar, low profile','Cotton laces']::text[], '{"Material":"Full-grain leather, rubber sole","Fit":"True to size","Care":"Wipe clean, leather protector","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['bestseller']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Bone', '#F2EEE6', 0),
  ('Ink', '#111114', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('trail-boot', 'Trail Chelsea Boot', 'Hassi Atelier', 17200, null, 'Footwear', ARRAY['40','41','42','43','44','45']::text[], 4, 4.6, 15, 'Vol. 01', 'A waxed-suede Chelsea boot on a lugged sole. Built for the commute and the mountain both.', ARRAY['Waxed suede upper','Lugged rubber sole','Elastic side panels','Pull tab at heel']::text[], '{"Material":"Waxed suede, rubber sole","Fit":"True to size","Care":"Suede brush, waterproof spray","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['low-stock']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Charcoal', '#2A2A30', 0),
  ('Rust', '#B5502D', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('index-cap', 'Index Wool Cap', 'Hassi Studio', 3200, null, 'Accessories', ARRAY['One Size']::text[], 30, 4.2, 27, 'Vol. 02', 'A six-panel wool cap with a low crown and curved brim. No branding, just the shape.', ARRAY['Wool-blend twill','Six-panel construction','Adjustable strap closure','Low crown, curved brim']::text[], '{"Material":"80% wool, 20% nylon","Fit":"Adjustable, one size","Care":"Spot clean","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['new']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Ink', '#111114', 0),
  ('Stone', '#8A8681', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('belt-01', 'Full-Grain Belt', 'Hassi Studio', 4600, null, 'Accessories', ARRAY['S/M','L/XL']::text[], 25, 4.5, 31, 'Vol. 01', 'A full-grain leather belt with a matte brushed buckle. Ages well, holds its line.', ARRAY['Full-grain leather','Matte brushed metal buckle','3.5cm width','Ages and patinas with wear']::text[], '{"Material":"Full-grain leather","Fit":"See size chart","Care":"Wipe clean, leather conditioner","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY[]::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Ink', '#111114', 0),
  ('Clay', '#C9C2B4', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('deck-shoe', 'Deck Canvas Shoe', 'Hassi Standard', 6400, null, 'Footwear', ARRAY['39','40','41','42','43','44']::text[], 15, 4.1, 12, 'Vol. 02', 'A washed-canvas deck shoe with a vulcanised sole. Warm-weather standard issue.', ARRAY['Washed cotton canvas','Vulcanised rubber sole','Breathable, lightweight','Cotton laces']::text[], '{"Material":"Cotton canvas, rubber sole","Fit":"True to size","Care":"Machine wash cold, air dry","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY[]::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Sand', '#E8E2D9', 0),
  ('Ink', '#111114', 1)
) as v(name, hex, sort_order);

with new_product as (
  insert into products (slug, name, brand, price, compare_at_price, category, sizes, stock, rating, review_count, drop_name, description, highlights, details, shipping, returns, tags)
  values ('weekender-holdall', 'Weekender Holdall', 'Hassi Atelier', 15800, null, 'Bags', ARRAY['One Size']::text[], 7, 4.7, 22, 'Vol. 01', 'A structured canvas holdall with leather handles and a detachable strap. Built for the short trip.', ARRAY['Waxed canvas body','Full-grain leather handles','Detachable, adjustable strap','45L capacity']::text[], '{"Material":"Waxed canvas, leather trim","Fit":"52 x 28 x 24cm","Care":"Wipe clean","Made in":"Made in Karachi, Pakistan"}'::jsonb, 'Free standard shipping on orders over $54. Standard delivery in 5-7 business days, express in 2-3 business days for $5.', '30-day returns on unworn pieces with tags attached. Store credit issued instantly; refunds to original payment method within 5-7 business days.', ARRAY['low-stock']::text[])
  returning id
)
insert into product_colors (product_id, name, hex, sort_order)
select id, v.name, v.hex, v.sort_order from new_product, (values
  ('Ink', '#111114', 0),
  ('Moss', '#525F45', 1)
) as v(name, hex, sort_order);

insert into blog_posts (slug, title, category, excerpt, body, author, published_at, featured)
values ('how-to-build-a-timeless-wardrobe', 'How to Build a Timeless Wardrobe', 'Style', 'Fewer, better pieces beat a closet full of noise. Here''s how we think about building a wardrobe that lasts years, not seasons.', ARRAY['A timeless wardrobe isn''t about owning less for the sake of it - it''s about owning things that keep earning their place. Every piece in a considered rotation should do more than one job: the overcoat that works over a suit and over a hoodie, the trouser that moves from studio to dinner.','Start with fabric, not fit. Fit can be adjusted; a fabric that pills, bags, or fades unevenly cannot be undone. Wool, selvedge denim, and full-grain leather all age toward character rather than away from it - that''s the test we build every drop against.','Then build outward from three anchors: a coat, a trouser, and a knit, all in colors that speak to each other. Everything else - accessories, layers, footwear - should be chosen to extend those three, not compete with them.','The result is a wardrobe that photographs the same in year one and year five, because nothing in it was ever a trend to begin with.']::text[], 'Hassi Studio', '2026-05-13', true);

insert into blog_posts (slug, title, category, excerpt, body, author, published_at, featured)
values ('5-style-tips-for-summer-2026', '5 Style Tips for Summer 2026', 'Fashion', 'Lighter fabrics, looser silhouettes, and five ways to keep your rotation sharp through the heat.', ARRAY['Summer dressing rewards restraint. Drop the layering logic of winter and let single pieces do the talking - a well-cut linen shirt worn open over a plain tee does more work than three accessories combined.','1. Go up a shade. Sand, bone, and clay reflect heat and light better than black - and they photograph warmer too.','2. Loosen the leg. Wide-leg trousers and relaxed shorts move air; slim fits trap it.','3. One statement accessory, not three. A single cap or tote is a choice; five is clutter.','4. Canvas over leather for footwear when the temperature climbs - it breathes and it''s easier to keep clean.','5. Wash less, air more. Linen and cotton knits recover their shape on a hanger in the shade faster than in a machine.']::text[], 'Ayesha M.', '2026-06-02', false);

insert into blog_posts (slug, title, category, excerpt, body, author, published_at, featured)
values ('the-ultimate-sneaker-guide', 'The Ultimate Sneaker Guide', 'Footwear', 'From low-profile leather to canvas deck shoes - how to pick the right pair for the way you actually move.', ARRAY['A good sneaker rotation covers three situations: the everyday low-profile pair that goes with everything, a boot for weather and structure, and a canvas pair for warm months.','Leather sneakers reward a bit of maintenance - a soft brush and a leather protector spray every few weeks keeps the upper from cracking and the color from patching unevenly.','Fit matters more in low-profile silhouettes than boots - there''s less structure to hide a half-size mismatch. When in doubt with our Form Low Sneaker, true to size is the right call.']::text[], 'Danish A.', '2026-04-21', false);

insert into blog_posts (slug, title, category, excerpt, body, author, published_at, featured)
values ('sustainable-fashion-the-future', 'Sustainable Fashion: The Future', 'Sustainability', 'Slower production, better materials, and why we make a small number of things instead of chasing every trend.', ARRAY['The fastest way to make fashion more sustainable isn''t a new fabric - it''s making less of it, better. We plan two drops a year instead of fifty-two, which means every piece is designed to be worn for years, not weeks.','Vegetable-tanned leather, recycled nylon shells, and undyed wool all show up across the line not as a marketing layer but because they hold up longer and age with more character than their conventional counterparts.','The most sustainable garment is still the one already in your closet - so our return policy exists to get sizing right the first time, not to encourage over-ordering.']::text[], 'Hassi Studio', '2026-03-11', false);

insert into blog_posts (slug, title, category, excerpt, body, author, published_at, featured)
values ('behind-the-hassi-brand', 'Behind the Hassi Brand', 'Studio', 'Why we started in Karachi, why we chase fewer better pieces, and what Vol. 01 was built to prove.', ARRAY['Hassi started as a question: could a small studio out of Karachi make pieces that stood next to anything coming out of Milan or Tokyo, without pretending to be from either place?','Vol. 01 was the answer - eighteen pieces, two seasons of fabric sourcing, and a refusal to ship anything we wouldn''t wear ourselves for the next five years.','Every future drop will be smaller than the last season''s noise and larger in what it actually replaces in your rotation. That''s the whole brand, really.']::text[], 'Hassi Studio', '2026-02-04', false);

