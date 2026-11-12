CREATE TABLE products(id TEXT PRIMARY KEY, category TEXT NOT NULL,name TEXT NOT NULL,note TEXT NOT NULL, pack TEXT NOT NULL DEFAULT '',price REAL, image TEXT);
--> statement-breakpoint
CREATE TABLE portal_accounts(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL,first_seen TEXT NOT NULL,last_seen TEXT NOT NULL);
--> statement-breakpoint
INSERT INTO products(id,category,name,note,pack,price,image) VALUES 
('gold-choco-orange','gold','Choco Orange','Dark cocoa with vibrant zesty orange','100g pouch',246,'media/products/gold-choco-orange.webp'),
('gold-caramel','gold','Caramel','Silky burnt sugar & butterscotch finish','100g pouch',283,'media/products/gold-caramel.webp'),
('gold-hazelnut','gold','Hazelnut','Rich creamy roasted hazelnut notes','100g pouch',210,'media/products/gold-hazelnut.webp'),
('gold-almond','gold','Almond','Nutty, subtly sweet toasted almond notes','100g pouch',231,'media/products/gold-almond.webp'),
('gold-cardamom','gold','Cardamom','Traditional aromatic Coorg cardamom','100g pouch',243,'media/products/gold-cardamom.webp'),
('gold-berry','gold','Berry','Wild berry brightness with floral honey','100g pouch',242,'media/products/gold-berry.webp'),
('gold-vanilla','gold','Vanilla','Soft Madagascar vanilla warmth','100g pouch',242,'media/products/gold-vanilla.webp'),
('gold-mint','gold','Mint','Crisp peppermint balanced with rich coffee','100g pouch',240,'media/products/gold-mint.webp'),
('silver-agglo-pure','silver','Agglo Pure','100% pure instant coffee · Zero chicory','100g pouch',183,'media/products/silver-agglo-pure.webp'),
('silver-agglo-prime70','silver','Agglo Prime 70','70% coffee · 30% chicory granular','100g pouch',151,'media/products/silver-agglo-prime70.webp'),
('silver-agglo-imperial60','silver','Agglo Imperial 60','60% coffee · 40% chicory granular','100g pouch',146,'media/products/silver-agglo-imperial60.webp'),
('silver-prime70','silver','Prime 70','70% coffee · 30% chicory spray-dried','100g pouch',143,'media/products/silver-prime70.webp'),
('silver-imperial60','silver','Imperial 60','60% coffee · 40% chicory spray-dried','100g pouch',136,'media/products/silver-imperial60.webp'),
('diamond-freeze-dried','diamond','Freeze Dried','100% pure freeze-dried single estate','100g jar',357,'media/products/diamond-freeze_dried.webp'),
('diamond-spiced','diamond','Spiced Reserve','Natural Western Ghats spices infusion','100g pouch',294,'media/products/diamond-spiced.webp');
