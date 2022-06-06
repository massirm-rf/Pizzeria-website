function Panier() {
    this.cart = [];
    this.total = 0;
    //les pizzas personalizes de la commande 
    this.pizzas_compose = [];
    this.add = function (item) {
        this.cart.push(item);
        this.total += parseInt(item[2]);
    }

    this.add_product = function (item) {
        this.cart.push(item);
        this.total += parseInt(item.product_price);
    }

    //comparer le contenu de deux tableaux
    this.compare = function (a, b) {
        if (a.length != b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
    //remove an item from the cart
    this.remove = function (item) {
        for (let i = 0; i < this.cart.length; i++) {
            if (this.compare(this.cart[i], item)) {
                this.cart.splice(i, 1);
                this.total -= parseInt(item[2]);
                return;
            }
        }
    }

    this.remove2 = function (indice) {
        //supprimer l'element d'indice indice du tableau cart
        this.total -= parseInt(this.cart[indice].product_price);
        this.cart.splice(indice, 1);

    }

    this.get = function () {
        return this.cart;
    }
    this.getTotal = function () {
        return this.total;
    }

    this.clear = function () {
        this.cart = [];
        this.total = 0;
    }
}

module.exports = new Panier();