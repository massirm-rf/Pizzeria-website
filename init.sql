-- creer une base de données pour une pizzeria
DROP table if exists pizza;

DROP table if exists ingredient;

DROP TABLE if exists pizza_ingredient;

DROP TABLE if exists boisson;

DROP TABLE if exists boisson_ingredient;

DROP TABLE if exists entree;

--table pour les pizzas
CREATE TABLE pizza (
    nom VARCHAR(50) PRIMARY KEY,
    prix INTEGER NOT NULL
);

--table pour les ingredients
CREATE TABLE ingredient (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL
);

--table pour les desserts
CREATE TABLE dessert (
    nom VARCHAR(50) PRIMARY KEY,
    prix INTEGER NOT NULL
);

--table pour les boissons avec taille
CREATE TABLE boisson (
    nom VARCHAR(50) NOT NULL,
    taille VARCHAR(50) NOT NULL,
    prix INTEGER NOT NULL,
    UNIQUE (nom, taille)
);

--table pour les entrees
CREATE TABLE entree (
    nom VARCHAR(50) PRIMARY KEY,
    prix INTEGER NOT NULL,
    sauce VARCHAR(50) NOT NULL
);

--table pour les pizzas_ingredients
CREATE TABLE pizza_ingredient (
    pizza_name VARCHAR(50) NOT NULL,
    ingredient_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (pizza_name, ingredient_name),
    FOREIGN KEY (pizza_name) REFERENCES pizza(nom),
    FOREIGN KEY (ingredient_name) REFERENCES ingredient(nom)
);

--table pour les clients 
CREATE TABLE client (
    id_client SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    UNIQUE (nom, prenom, telephone, email)
);

--table por les commandes
CREATE TABLE commande (
    id SERIAL PRIMARY KEY,
    id_client INTEGER NOT NULL,
    total INTEGER NOT NULL,
    adresse_livraison VARCHAR(80) NOT NULL,
    complement_adresse VARCHAR(80) NOT NULL,
    heure_commande TIME NOT NULL DEFAULT CURRENT_TIME,
    heure_livraison TIME NOT NULL,
    livre BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_client) REFERENCES client(id_client)
);

--table pour les livraison en cours
CREATE TABLE livraison_encours (
    id_commande INTEGER NOT NULL,
    id_livreur VARCHAR(50) NOT NULL,
    UNIQUE (id_commande),
    UNIQUE (id_livreur),
    FOREIGN KEY (id_commande) REFERENCES commande(id)
);

--table pour les commandes_pizzas
CREATE TABLE commande_pizza (
    -- id INTEGER PRIMARY KEY,
    commande_id INTEGER NOT NULL,
    nom VARCHAR(50) NOT NULL,
    pizza_size VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY(commande_id) REFERENCES commande(id),
    FOREIGN KEY(nom) REFERENCES pizza(nom)
);

--table pour les commandes_boissons
CREATE TABLE commande_boisson (
    commande_id INTEGER NOT NULL,
    nom VARCHAR(50) NOT NULL,
    taille VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY(commande_id) REFERENCES commande(id) --, FOREIGN KEY(nom) REFERENCES boisson(nom)
);

--table pour les commandes_entrees
CREATE TABLE commande_entree (
    commande_id INTEGER NOT NULL,
    nom VARCHAR(50) NOT NULL,
    sauce VARCHAR(30) NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY(commande_id) REFERENCES commande(id),
    FOREIGN KEY(nom) REFERENCES entree(nom)
);

CREATE TABLE commande_dessert (
    commande_id INTEGER NOT NULL,
    nom VARCHAR(50) NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY(commande_id) REFERENCES commande(id),
    FOREIGN KEY(nom) REFERENCES dessert(nom)
);

--table pour les pizzas personalises
CREATE TABLE pizza_personalize (
    id SERIAL PRIMARY KEY,
    size VARCHAR(2) NOT NULL,
    price INTEGER NOT NULL
);

-- table pour les pizzas personalises_ingredients
CREATE TABLE pizza_perso_ingredient (
    pizza_perso_id INTEGER NOT NULL,
    ingredient_name VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (pizza_perso_id, ingredient_name),
    FOREIGN KEY (pizza_perso_id) REFERENCES pizza_personalize(id),
    FOREIGN KEY (ingredient_name) REFERENCES ingredient(nom)
);

CREATE TABLE commande_perso(
    commande_id INTEGER NOT NULL,
    pizza_perso_id INTEGER NOT NULL,
    FOREIGN KEY(commande_id) REFERENCES commande(id),
    FOREIGN KEY(pizza_perso_id) REFERENCES pizza_personalize(id)
);

--creer des pizzas
INSERT INTO
    pizza (nom, prix)
VALUES
    ('Margherita', 8);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('3 Fromages', 10);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Chevre miel', 10);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Raclette', 11.5);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Oriental', 8.5);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Végétarienne', 7.5);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Pepperoni', 7);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Jambon', 7);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Saumonita', 10);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Royale', 10);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Mexicaine', 10);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('3 Jambons', 10);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Speciale', 12);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Miami', 12);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Chicken', 8);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Tartiflette', 8);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Savoyarde', 11);

INSERT INTO
    pizza (nom, prix)
VALUES
    ('Normande', 10.50);

--inserer les ingredients
INSERT INTO
    ingredient (nom)
VALUES
    ('Sauce tomate');

INSERT INTO
    ingredient (nom)
VALUES
    ('Crème fraîche');

INSERT INTO
    ingredient (nom)
VALUES
    ('Sauce Barbecue');

INSERT INTO
    ingredient (nom)
VALUES
    ('Jambon');

INSERT INTO
    ingredient (nom)
VALUES
    ('Mozzarella');

INSERT INTO
    ingredient (nom)
VALUES
    ('Tomate');

INSERT INTO
    ingredient (nom)
VALUES
    ('Oignon');

INSERT INTO
    ingredient (nom)
VALUES
    ('Champignon');

INSERT INTO
    ingredient (nom)
VALUES
    ('Piment');

INSERT INTO
    ingredient (nom)
VALUES
    ('Olive');

INSERT INTO
    ingredient (nom)
VALUES
    ('Poulet');

INSERT INTO
    ingredient (nom)
VALUES
    ('Viande hachée');

INSERT INTO
    ingredient (nom)
VALUES
    ('Poivron');

INSERT INTO
    ingredient (nom)
VALUES
    ('Pepperoni');

INSERT INTO
    ingredient (nom)
VALUES
    ('Oeuf');

INSERT INTO
    ingredient (nom)
VALUES
    ('Thon');

INSERT INTO
    ingredient (nom)
VALUES
    ('Saumon');

INSERT INTO
    ingredient (nom)
VALUES
    ('Merguez');

INSERT INTO
    ingredient (nom)
VALUES
    ('Emmental');

INSERT INTO
    ingredient (nom)
VALUES
    ('Reblochon');

INSERT INTO
    ingredient (nom)
VALUES
    ('Fourme dambert');

INSERT INTO
    ingredient (nom)
VALUES
    ('Cheddar');

INSERT INTO
    ingredient (nom)
VALUES
    ('Miel');

INSERT INTO
    ingredient(nom)
VALUES
    ('Fromage chèvre');

INSERT INTO
    ingredient(nom)
VALUES
    ('Pommes de terres');

INSERT INTO
    ingredient(nom)
VALUES
    ('Lardons');

INSERT INTO
    ingredient(nom)
VALUES
    ('Bacon');

INSERT INTO
    ingredient(nom)
VALUES
    ('Reblechon');

INSERT INTO
    ingredient(nom)
VALUES
    ('Raclette');

--Inserer les boissons
INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Coca', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Coca', '1L', 2.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Coca-Zero', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Coca-Zero', '1L', 2.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Fanta', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Fanta', '1L', 2.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Sprite', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Sprite', '1L', 2.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Pepsi', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Pepsi', '1L', 2.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Orangina', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Orangina', '1L', 2.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Fuze Tea', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Fuze Tea', '1L', 2.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Oasis Tropical', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Oasis Tropical', '2L', 3.4);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('RedBull', '33cl', 2);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Evian', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Evian', '1L', 2.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Perrier', '33cl', 1.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Perrier', '1.25L', 2.5);

INSERT INTO
    boisson (nom, taille, prix)
VALUES
    ('Heinken', '33cl', 1.5);

--Inserer les entrees
INSERT INTO
    entree (nom, prix, sauce)
VALUES
    ('Salade Caesar', 5, 'Sauce Caesar');

INSERT INTO
    entree (nom, prix, sauce)
VALUES
    ('Salade Capre', 5, 'Sauce Basilic');

INSERT INTO
    entree (nom, prix, sauce)
VALUES
    ('Potatoes', 3, 'Sauce Potatoes');

INSERT INTO
    entree (nom, prix, sauce)
VALUES
    ('Chicken Spicy Wings', 5, 'Sauce BBQ');

INSERT INTO
    entree (nom, prix, sauce)
VALUES
    ('Chicken Nuggets', 5, 'Sauce BBQ');

INSERT INTO
    entree (nom, prix, sauce)
VALUES
    ('Sticks Cheese', 4.5, 'Sauce Ciboulette');

--Inserer les desserts
INSERT INTO
    dessert (nom, prix)
VALUES
    ('Tiramisu', 5);

INSERT INTO
    dessert (nom, prix)
VALUES
    ('Cookie Dough 100 ml', 3);

INSERT INTO
    dessert (nom, prix)
VALUES
    ('Vanilla Pecan Brittle 100ml', 3);

INSERT INTO
    dessert (nom, prix)
VALUES
    ('Chocolate Fudge Brownie 100 ml', 3);

INSERT INTO
    dessert (nom, prix)
VALUES
    ('Cone Together 465 ml', 6.75);

INSERT INTO
    dessert (nom, prix)
VALUES
    ('Cookie Dough 465 ml', 6.75);

INSERT INTO
    dessert (nom, prix)
VALUES
    ('Vanilla Pecan Blondie', 6.85);

INSERT INTO
    dessert (nom, prix)
VALUES
    ('Chocolate Fudge Brownie 465 ml', 6.75);

INSERT INTO
    dessert (nom, prix)
VALUES
    ('Caramel Brownie Party 465ml', 6.75);

--Inserer les ingredients sur les pizzas
INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Margherita', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Margherita', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Fromages', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Fromages', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Fromages', 'Emmental');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Fromages', 'Fromage chèvre');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Fromages', 'Fourme dambert');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Fromages', 'Cheddar');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Chevre miel', 'Crème fraîche');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Chevre miel', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Chevre miel', 'Fromage chèvre');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Chevre miel', 'Miel');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Raclette', 'Crème fraîche');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Raclette', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Raclette', 'Raclette');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Raclette', 'Pommes de terres');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Raclette', 'Oignon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Oriental', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Oriental', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Oriental', 'Oignon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Oriental', 'Poivron');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Oriental', 'Merguez');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Végétarienne', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Végétarienne', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Végétarienne', 'Oignon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Végétarienne', 'Poivron');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Végétarienne', 'Olive');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Pepperoni', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Pepperoni', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Pepperoni', 'Pepperoni');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Jambon', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Jambon', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Jambon', 'Jambon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Saumonita', 'Crème fraîche');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Saumonita', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Saumonita', 'Saumon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Saumonita', 'Oignon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Saumonita', 'Pommes de terres');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Royale', 'Sauce Barbecue');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Royale', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Royale', 'Viande hachée');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Royale', 'Merguez');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Royale', 'Poulet');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Mexicaine', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Mexicaine', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Mexicaine', 'Viande hachée');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Mexicaine', 'Oignon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Mexicaine', 'Oeuf');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Jambons', 'Crème fraîche');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Jambons', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Jambons', 'Jambon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Jambons', 'Pepperoni');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('3 Jambons', 'Lardons');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Speciale', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Speciale', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Speciale', 'Champignon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Speciale', 'Poulet');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Speciale', 'Emmental');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Miami', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Miami', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Miami', 'Pommes de terres');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Miami', 'Jambon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Miami', 'Cheddar');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Chicken', 'Crème fraîche');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Chicken', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Chicken', 'Poulet');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Chicken', 'Oignon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Chicken', 'Olive');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Tartiflette', 'Crème fraîche');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Tartiflette', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Tartiflette', 'Bacon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Tartiflette', 'Jambon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Tartiflette', 'Lardons');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Savoyarde', 'Crème fraîche');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Savoyarde', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Savoyarde', 'Pommes de terres');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Savoyarde', 'Lardons');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Savoyarde', 'Reblechon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Normande', 'Sauce tomate');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Normande', 'Mozzarella');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Normande', 'Oignon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Normande', 'Thon');

INSERT INTO
    pizza_ingredient (pizza_name, ingredient_name)
VALUES
    ('Normande', 'Olive');