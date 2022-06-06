
const express = require('express');
const panier = require('./Panier');
const path = require('path');
const serv = express();
const queries = require('./queries');
const bodyParser = require("body-parser");
serv.use(express.urlencoded({ extended: true }));
serv.use(express.json());
info = [];



serv.use(express.static('public'));

serv.set("view engine", 'ejs');
serv.use(bodyParser.urlencoded({ extended: true }));

serv.get('/', function (req, res) {
    res.render("accueil.ejs");
});

serv.get('/pizzas', (req, res) => {
    queries.getPizza().then(result => {
        info.panier = panier.get();
        info.nom = result.rows.map(pizza => pizza.nom);
        info.prix = result.rows.map(pizza => pizza.prix);
        info.total = panier.getTotal();
        res.render("pizzas.ejs", info);
    });
});

serv.get('/entree', (req, res) => {
    queries.getEntree().then(result => {
        info.panier = panier.get();
        info.nom = result.rows.map(entree => entree.nom);
        info.prix = result.rows.map(entree => entree.prix);
        info.sauce = result.rows.map(entree => entree.sauce);
        info.total = panier.getTotal();
        queries.getEntreeSauce().then(result1 => {
            info.sauce_entree = result1.rows.map(entree => entree.sauce);
            res.render("entree.ejs", info);
        });
    });
})

serv.get('/accueil', function (req, res) {
    res.render("accueil.ejs");
});

serv.get('/boissons', function (req, res) {
    queries.operations().then(result => {
        info.panier = panier.get();
        info.nom = result.rows.map(boisson => boisson.nom);
        info.prix = result.rows.map(boisson => boisson.prix);
        info.size = result.rows.map(boisson => boisson.taille);
        info.total = panier.getTotal();
        res.render("boissons.ejs", info);

    });
});

serv.get('/desserts', function (req, res) {
    queries.getDessert().then(result => {
        info.panier = panier.get();
        info.nom = result.rows.map(dessert => dessert.nom);
        info.prix = result.rows.map(dessert => dessert.prix);
        info.total = panier.getTotal();
        res.render("desserts.ejs", info);
    });
});

serv.get('/about', (req, res) => {
    res.render('about.ejs');
});

serv.get('/Contact', (req, res) => {
    res.render(('contact.ejs'));
});

serv.get('/personalize', (req, res) => {
    queries.getIngredient().then(result => {
        info.nom = result.rows.map(ingredient => ingredient.nom);
        res.render('personalize.ejs', info);
    }).catch(err => console.log(err));

});

serv.get('/livraison', (req, res) => {
    res.render('livreur.ejs');
});

serv.post('/add', (req, res) => {
    let prod = req.body.prod;
    panier.add_product(prod);
    var total = panier.getTotal();
    res.json({ total: total, panier: panier.get() });
});

serv.post('/remove', (req, res) => {
    let id = req.body.idToRemove;
    panier.remove2(id);
    let pop = panier.get();
    res.json({ total: panier.getTotal(), panier: panier.get() });
});

serv.post('/perso_size', (req, res) => {
    let size = req.body.size;
    let price = req.body.price;
    queries.add_perso_pizza(size, price).then(result => {
        res.json({ result: result.rows[0].max });
    }).catch(err => {
        console.log(err);
    });
});

serv.post('/add_perso_ing', (req, res) => {
    let id = req.body.id;
    let ing = req.body.ingredient;
    let quantity = req.body.quantity;
    queries.add_ingr_to_perso(id, ing, quantity).then(result => {
        res.json({ result: result.rows[0].sum });
    }).catch(err => {
        console.log(err);
    });
});

serv.post('/remove_perso_ing', (req, res) => {
    let id = req.body.id;
    let ing = req.body.ingredient;
    let quantity = req.body.quantity;
    queries.remove_ingr_from_perso(id, ing, quantity).then(result => {
        //envoyer le nombre d'ingredients total sur la pizza
        res.json({ result: result.rows[0].sum });
    }).catch(err => {
        console.log(err);
    });
});

serv.post('/edit_size', (req, res) => {
    let id = req.body.id;
    let last_size = req.body.last_size;
    let new_size = req.body.new_size;
    let price = req.body.price;
    queries.edit_perso_size(id, last_size, new_size, price).then(result => {
        res.send(result);
    }).catch(err => {
        console.log(err);
    });
});

serv.post('/add_perso_to_cart', (req, res) => {
    panier.add_product(req.body.perso);
    info.total = panier.getTotal();
    res.render('pizzas.ejs', info);
});

serv.post("/get_perso_ingredients", (req, res) => {
    let id = req.body.id;
    queries.get_perso_ingredients(id).then(result => {
        res.json({ result: result.rows });
    });
});

serv.post("/get_prod_description", (req, res) => {
    let name = req.body.name;
    queries.getPizzaIngredients(name).then(result => {
        res.json({ result: result.rows.map(pizza => pizza.ingredient_name) });
    });
});

serv.get("/clientInformations", (req, res) => {
    res.render('infoClient.ejs');
});

serv.post("/clientInformations", (req, res) => {
    queries.add_client(req.body).then(result => {
        id_client = result.rows[0].id;
        queries.create_commande(id_client, req.body, panier.getTotal()).then(result => {
            id_commande = result.rows[0].max;
            queries.create_commande_details(panier.get(), id_commande).then(result => {
                //afficher un message de succes et rediriger vers la page de confirmation

            }).then(result => {
                panier.clear();
                res.redirect('/pizzas');

            });
        });
    }).catch(err => {
        console.log(err);
    });
    // panier.clear(); ce n'est pas sa place!!!

});

serv.post("/livraison", (req, res) => {
    //on verifie si le livreur a déja une commande en cours de livraison
    queries.get_livreur_commande(req.body.identifiant).then(result => {
        if (result.rows.length > 0) {
            queries.getCommande(info.id_commande = result.rows[0].id).then(result => {
                info.bool = true;
                info.command_exist = true;
                info.livreur = req.body.identifiant;
                info.adresse_livraison = result.rows[0].adresse_livraison;
                info.complement_adresse = result.rows[0].complement_adresse;
                info.heure_livraison = result.rows[0].heure_livraison;
                info.nom_client = result.rows[0].nom;
                info.prenom_client = result.rows[0].prenom;
                info.telephone_client = result.rows[0].telephone;
                info.prix_total = result.rows[0].total;
                get_commande_livraison(res, info.id_commande, info);
            });
        } else {
            //recuperer la commande la plus ancienne et la proposer pour le livreur
            queries.getNextCommande().then(result => {
                if (result.rows.length > 0) {
                    info.livreur = req.body.identifiant;
                    info.bool = false;
                    info.command_exist = true;
                    info.id_commande = result.rows[0].id;
                    info.adresse_livraison = result.rows[0].adresse_livraison;
                    info.complement_adresse = result.rows[0].complement_adresse;
                    info.heure_livraison = result.rows[0].heure_livraison;
                    info.nom_client = result.rows[0].nom;
                    info.prenom_client = result.rows[0].prenom;
                    info.telephone_client = result.rows[0].telephone;
                    info.prix_total = result.rows[0].total;
                    queries.getPizza_commande(info.id_commande).then(result => {
                        info.pizzas = result.rows;
                        queries.getEntree_commande(info.id_commande).then(result => {
                            info.entree = result.rows;
                            queries.getDessert_commande(info.id_commande).then(result => {
                                info.dessert = result.rows;
                                queries.getBoisson_commande(info.id_commande).then(result => {
                                    info.boisson = result.rows;
                                    queries.getPizzaPerso_commande(info.id_commande).then(result => {
                                        info.pizza_perso = result.rows;
                                        res.render('livraison.ejs', info);
                                    });
                                });
                            });
                        });
                    });
                }
                else {
                    info.command_exist = false;
                    info.livreur = req.body.identifiant;
                    res.render('livraison.ejs', info);
                }
            });
        }
    });
});

serv.post("/dispatch", (req, res) => {

    queries.dispatch(req.body.id_commande, req.body.id_livreur).then(result => {
        //rediriger vers la requete post précédente
        res.redirect('/livraison');
    });
});

serv.post("/done", (req, res) => {
    queries.done(req.body.id_commande).then(result => {
        res.redirect('/livraison');
    });
});

//creer une focntion qui recupere la commande en cours de livraison
//qui recupere les pizzas, les entrees, les desserts, les boissons et les pizzas perso

function get_commande_livraison(res, id_commande, info) {
    queries.getPizza_commande(id_commande).then(result => {
        info.pizzas = result.rows;
        queries.getEntree_commande(id_commande).then(result => {
            info.entree = result.rows;
            queries.getDessert_commande(id_commande).then(result => {
                info.dessert = result.rows;
                queries.getBoisson_commande(id_commande).then(result => {
                    info.boisson = result.rows;
                    queries.getPizzaPerso_commande(id_commande).then(result => {
                        info.pizza_perso = result.rows;
                        res.render('livraison.ejs', info);
                    });
                });
            });
        });
    });
}

serv.listen(8080, () => {
    console.log("server started at port 8080");
});
