const pool = require('./db');


//fonction qui retourne le nom de la pizza
function getPizza() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM pizza`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
function getBoisson() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM boisson`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
}

function getDessert() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM dessert`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getPizzaSauce() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT ingredient_name FROM pizza_ingredient WHERE ingredient_name LIKE 'Sauce%' or ingredient_name LIKE 'Crème%' `, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
}

function getSauces() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT Distinct ingredient_name FROM pizza_ingredient WHERE ingredient_name LIKE 'Sauce%' or ingredient_name LIKE 'Crème%' `, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
}

async function getEntree() {
    const client = await pool.connect();
    let res = await client.query("SELECT * FROM entree");
    client.release();
    return res;
}

async function getEntreeSauce() {
    const client = await pool.connect();
    let res = await client.query("SELECT DISTINCT sauce FROM entree");
    client.release();
    return res;
}

async function getIngredient() {
    const client = await pool.connect();
    let res = await client.query("SELECT * FROM ingredient");
    client.release();
    return res;
}

async function add_perso_pizza(size, price) {
    const client = await pool.connect();
    let res = await client.query(`INSERT INTO pizza_personalize(size,price) VALUES ('${size}', '${price}')`);
    res = await client.query('SELECT MAX(id) FROM pizza_personalize');
    client.release();
    return res;
}

//ajouter un ingredient à une pizza personnalisée et retourne le nombre d'ingrédient total dans la pizza
async function add_ingr_to_perso(pizza_perso_id, ingredient_name, quantity) {
    const client = await pool.connect();
    let qnt = await client.query(`SELECT quantity from pizza_perso_ingredient WHERE pizza_perso_id = ${pizza_perso_id} AND ingredient_name = '${ingredient_name}'`);
    // si le nombre d'ingrédient est égal à 0, on ajoute l'ingrédient
    if (qnt.rows.length == 0) {
        let res = await client.query(`INSERT INTO pizza_perso_ingredient(pizza_perso_id, ingredient_name,quantity) VALUES ('${pizza_perso_id}', '${ingredient_name}','${quantity}')`);
        res = await client.query(`SELECT SUM(quantity) FROM pizza_perso_ingredient WHERE pizza_perso_id =${pizza_perso_id}`);
        client.release();
        return res;
    } else {
        // sinon on ajoute la quantité à l'ingrédient déjà présent
        let tot_qnt = qnt.rows[0].quantity + parseInt(quantity);
        let res = await client.query(`UPDATE pizza_perso_ingredient SET quantity = ${tot_qnt} WHERE pizza_perso_id = ${pizza_perso_id} AND ingredient_name = '${ingredient_name}'`);
        res = await client.query(`SELECT SUM(quantity) FROM pizza_perso_ingredient WHERE pizza_perso_id =${pizza_perso_id}`);
        client.release();
        return res;
    }
}

async function get_quantity(id, ingredient) {
    const client = await pool.connect();
    let res = await client.query(`SELECT quantity FROM pizza_perso_ingredient WHERE pizza_perso_id = ${id} AND ingredient_name = '${ingredient}'`);
    client.release();
    return res;
}

async function remove_ingr_from_perso(pizza_perso_id, ingredient_name, quantity) {
    const client = await pool.connect();
    // changer la quantité de l'ingrédient dans la pizza personnalisée
    let qnt = await client.query(`SELECT quantity from pizza_perso_ingredient WHERE pizza_perso_id = ${pizza_perso_id} AND ingredient_name = '${ingredient_name}'`);
    let tot_qnt = qnt.rows[0].quantity - parseInt(quantity);
    var res;
    if (tot_qnt == 0) {
        res = await client.query(`DELETE FROM pizza_perso_ingredient WHERE pizza_perso_id = ${pizza_perso_id} AND ingredient_name = '${ingredient_name}'`);
    } else {
        res = await client.query(`UPDATE pizza_perso_ingredient SET quantity = ${tot_qnt} WHERE pizza_perso_id = ${pizza_perso_id} AND ingredient_name = '${ingredient_name}'`);
    }
    res = await client.query(`SELECT SUM(quantity) FROM pizza_perso_ingredient WHERE pizza_perso_id =${pizza_perso_id}`);
    client.release();
    return res;
}

async function edit_perso_size(perso_id, last_size, new_size, new_price) {
    const client = await pool.connect();
    let res = await client.query(`UPDATE pizza_personalize SET size = '${new_size}', price = '${new_price}' WHERE id = ${perso_id} AND size = '${last_size}'`);
    client.release();
    return res;
}

// trouver les ingrédients d'une pizza personnalisée
async function get_perso_ingredients(id) {
    const client = await pool.connect();
    let res = await client.query(`SELECT * FROM pizza_perso_ingredient WHERE pizza_perso_id = ${id}`);
    client.release();
    return res;
}

//trouver les ingrédients d'une peizza prédifinie
async function getPizzaIngredients(pizza_name) {
    const client = await pool.connect();
    let res = await client.query(`SELECT ingredient_name FROM pizza_ingredient WHERE pizza_name = '${pizza_name}'`);
    client.release();
    return res;
}

//ajouter un client à la base de données s'il n'existe pas déjà sinon retourner l'id du client
async function add_client(obj) {
    const prenom = obj.prenomClient;
    const nom = obj.nomClient;
    const email = obj.Email;
    const phone = obj.tel;
    const client = await pool.connect();
    // on vérifie si le client existe déjà (nom,prenom,email,telephone)
    let res = await client.query(`SELECT id_client as id FROM client WHERE prenom = '${prenom}' AND nom='${nom}'AND telephone = '${phone}' AND email = '${email}'`);
    if (res.rows.length == 0) {
        // si le client n'existe pas on l'ajoute
        res = await client.query(`INSERT INTO client(nom,prenom,telephone,email) VALUES ('${nom}','${prenom}','${phone}', '${email}')`);
        res = await client.query('SELECT MAX(id_client) AS id FROM client');
        client.release();
        return res;
    } else {
        // sinon on retourne l'id du client
        client.release();
        return res;
    }
}



//creer une commande
async function create_commande(id_client, obj, total) {
    const adresse = obj.adress + ' ' + obj.cp + ' ' + obj.city;
    const adresse2 = obj.adress2;

    const heure_livraison = obj.heure;
    const client = await pool.connect();
    let res = await client.query(`INSERT INTO commande(id_client,total,adresse_livraison,complement_adresse,heure_livraison) VALUES ('${id_client}','${total}','${adresse}','${adresse2}','${heure_livraison}')`);
    // retourner l'identifiant de la commande crée
    res = await client.query(`SELECT MAX(id) FROM commande`);
    client.release();
    return res;
}

async function create_commande_details(panier, id_commande) {
    const client = await pool.connect();
    var res;
    for (let i = 0; i < panier.length; i++) {
        switch (panier[i].product_type) {
            case 'Perso':
                res = await client.query(`INSERT INTO commande_perso(commande_id,pizza_perso_id) VALUES ('${id_commande}', '${panier[i].product_id}')`);
                break;
            case 'pizza':
                res = await client.query(`INSERT INTO commande_pizza(commande_id, nom,pizza_size,price) VALUES ('${id_commande}', '${panier[i].product_name}', '${panier[i].product_size}','${panier[i].product_price} ')`);
                break;
            case 'entree':
                res = await client.query(`INSERT INTO commande_entree(commande_id, nom,sauce,price) VALUES ('${id_commande}', '${panier[i].product_name}','${panier[i].product_sauce}', '${panier[i].product_price}')`);
                break;
            case 'dessert':
                res = await client.query(`INSERT INTO commande_dessert(commande_id, nom,price) VALUES ('${id_commande}', '${panier[i].product_name}', '${panier[i].product_price}')`);
                break;
            case 'boisson':
                res = await client.query(`INSERT INTO commande_boisson(commande_id, nom,taille,price) VALUES ('${id_commande}', '${panier[i].product_name}','${panier[i].product_size}', '${panier[i].product_price}')`);
                break;
        }
    }
    client.release();
    return res;
}

async function getNextCommande() {
    //recuperer le detail de la commande suivante)
    const client = await pool.connect();
    let res = await client.query(`SELECT * FROM commande NATURAL JOIN client where livre = false
    AND id NOT in (select id_commande from livraison_encours)  ORDER BY heure_livraison LIMIT 1`);
    client.release();
    return res;
}

//recuperer les pizzas de la commandes
async function getPizza_commande(id) {
    const client = await pool.connect();
    let res = await client.query(`SELECT * FROM commande_pizza WHERE commande_id = ${id}`);
    client.release();
    return res;
}

//recuperer les entrees de la commandes
async function getEntree_commande(id) {
    const client = await pool.connect();
    let res = await client.query(`SELECT * FROM commande_entree WHERE commande_id = ${id}`);
    client.release();
    return res;
}

//recuperer les desserts de la commandes
async function getDessert_commande(id) {
    const client = await pool.connect();
    let res = await client.query(`SELECT * FROM commande_dessert WHERE commande_id = ${id}`);
    client.release();
    return res;
}

//recuperer les boissons de la commandes
async function getBoisson_commande(id) {
    const client = await pool.connect();
    let res = await client.query(`SELECT * FROM commande_boisson WHERE commande_id = ${id}`);
    client.release();
    return res;
}

//recuperer les pizzas perso de la commandes
async function getPizzaPerso_commande(id) {
    const client = await pool.connect();
    let res = await client.query(`SELECT * FROM commande_perso JOIN pizza_personalize ON (pizza_perso_id = id) WHERE commande_id = ${id}`);
    client.release();
    return res;
}

//dispatcher une commande pour un livreur
async function dispatch(id_commande, id_livreur) {
    const client = await pool.connect();
    let res = await client.query(`Insert into livraison_encours(id_commande,id_livreur) VALUES ('${id_commande}','${id_livreur}')`);
    client.release();
    return res;
}

//recuperer la commande (commande_id)
async function getCommande(id) {
    const client = await pool.connect();
    let res = await client.query(`SELECT * FROM commande NATURAL JOIN client WHERE id = ${id}`);
    client.release();
    return res;
}

async function get_livreur_commande(id_livreur) {
    const client = await pool.connect();
    let res = await client.query(`SELECT id_commande AS id FROM livraison_encours WHERE id_livreur = '${id_livreur}'`);
    client.release();
    return res;
}

async function done(id_commande) {
    const client = await pool.connect();
    let res = await client.query(`UPDATE commande SET livre = true WHERE id = ${id_commande}`);
    res = await client.query(`DELETE FROM livraison_encours WHERE id_commande = ${id_commande}`);
    client.release();
    return res;
}

async function operations() {
    const client = await pool.connect();
    // attente du résultat de la requête :
    let res = await client.query("SELECT * FROM boisson");
    client.release();
    return res;
};




module.exports = {
    getPizza, operations, getBoisson, getDessert, getPizzaSauce, getEntree, getEntreeSauce, getIngredient, add_ingr_to_perso, add_perso_pizza, remove_ingr_from_perso, edit_perso_size,
    get_perso_ingredients, getPizzaIngredients, create_commande, create_commande_details, add_client, getNextCommande, getPizza_commande, getEntree_commande, getDessert_commande, getBoisson_commande, getPizzaPerso_commande,
    dispatch, getCommande, get_livreur_commande, done
}
