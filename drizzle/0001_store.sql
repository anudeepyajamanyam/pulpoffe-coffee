CREATE TABLE products(id TEXT PRIMARY KEY, category TEXT NOT NULL,name TEXT NOT NULL,note TEXT NOT NULL, pack TEXT NOT NULL DEFAULT '',price REAL);
--> statement-breakpoint
CREATE TABLE portal_accounts(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL,first_seen TEXT NOT NULL,last_seen TEXT NOT NULL);
--> statement-breakpoint
INSERT INTO products(id,category,name,note) VALUES ('freeze-dried','instant','Freeze-dried pure instant','100% coffee'),
('agglomerated-pure','instant','Agglomerated pure instant','100% coffee'),
('agglomerated-60','instant','Agglomerated 60 / 40','60% coffee · 40% chicory'),
('agglomerated-70','instant','Agglomerated 70 / 30','70% coffee · 30% chicory'),
('spray-pure','instant','Spray-dried pure instant','100% coffee'),
('spray-60','instant','Spray-dried 60 / 40','60% coffee · 40% chicory'),
('spray-70','instant','Spray-dried 70 / 30','70% coffee · 30% chicory'),
('flavour-spiced','flavoured','Spiced instant coffee','Flavoured instant coffee'),
('flavour-almond','flavoured','Almond instant coffee','Flavoured instant coffee'),
('flavour-hazelnut','flavoured','Hazelnut instant coffee','Flavoured instant coffee'),
('flavour-choco-orange','flavoured','Choco Orange instant coffee','Flavoured instant coffee'),
('flavour-caramel','flavoured','Caramel instant coffee','Flavoured instant coffee'),
('flavour-cardamom','flavoured','Cardamom instant coffee','Flavoured instant coffee'),
('flavour-vanilla','flavoured','Vanilla instant coffee','Flavoured instant coffee'),
('flavour-mint','flavoured','Mint instant coffee','Flavoured instant coffee'),
('flavour-berry','flavoured','Berry instant coffee','Flavoured instant coffee'),
('fermented-whiskey-barrel-aged','fermented','Whiskey barrel aged coffee','Fermented roasted bean coffee powder'),
('fermented-pineapple','fermented','Pineapple coffee','Fermented roasted bean coffee powder'),
('fermented-cinnamon','fermented','Cinnamon coffee','Fermented roasted bean coffee powder'),
('fermented-wine','fermented','Wine coffee','Fermented roasted bean coffee powder'),
('roasted-pure','roasted','Pure roasted coffee','100% coffee powder'),
('roasted-60','roasted','60 / 40 roasted blend','60% coffee · 40% chicory'),
('roasted-70','roasted','70 / 30 roasted blend','70% coffee · 30% chicory'),
('roasted-80','roasted','80 / 20 roasted blend','80% coffee · 20% chicory');