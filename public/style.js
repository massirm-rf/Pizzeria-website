
$(document).ready(function () {

    $(".descr").hide();
    $(".prod_type").hide();
    $(".perso_id").hide();
    $("#boissons img").mouseover(function () {
        $(this).css("border", "solid 2px ");
        elt = $(this);
        getProdDescription(elt);

    });
    $("#boissons img").mouseout(function () {
        $(this).css("border", "5px solid rgb(255, 246, 246)");
        $(this).parent().find(".descr").hide(750);
    }
    );
    $("#bbtn").click(function () {
        $("#menu-nav ul li").each(function () {

            $(this).removeClass("active");
        });
        $("#bbtn").addClass("active");
    });

    $("#nospiz").click(function () {
        // getDrinks();
        $("#menu-nav ul li").each(function () {
            $(this).removeClass("active");
        });
        $("#nospiz").addClass("active");
    });

    $("#entree").click(function () {
        // getDrinks();
        $("#menu-nav ul li").each(function () {
            $(this).removeClass("active");
        });
        $("#entree").addClass("active");
    });

    $(".details").hide();

    $('.prod_id').hide();

    $("#nosmen").click(function () {
        $("#menu-nav ul li").each(function () {
            $(this).removeClass("active");
        });
        $("#nosmen").addClass("active");
    });

    $("#contact").click(function () {
        $("#menu-nav ul li").each(function () {
            $(this).removeClass("active");
        });
        $("#contact").addClass("active");
    });

    $("#about").click(function () {
        // getAbout();
        $("#menu-nav ul li").each(function () {
            $(this).removeClass("active");
        });
        $("#about").addClass("active");
    });

    $("body").on("click", ".dropdown-toggle", function () {
        det = $(this).parent().next();
        if (det.css('display') !== 'none') {
            det.hide();
        }
        else {
            perso_id = $(this).parent().find('.prod_id').text().trim();
            $.post("/get_perso_ingredients", { id: perso_id }, function (data) {
                str = "<ul>";
                result = data.result;
                for (let i = 0; i < result.length; i++) {
                    str += `<li>${result[i].quantity} x ${result[i].ingredient_name}</li>`;
                }
                str += "</ul>";
                det.html(str);
                det.show();
            });
        }
    });

    $(".dropdown-toggle").click(function () {
        det = $(this).parent().next();
        if (det.css('display') !== 'none') {
            det.hide();
        }
        else {
            perso_id = $(this).parent().find('.prod_id').text().trim();
            $.post("/get_perso_ingredients", { id: perso_id }, function (data) {
                str = "<ul>";
                result = data.result;
                for (let i = 0; i < result.length; i++) {
                    str += `<li>${result[i].quantity} x ${result[i].ingredient_name}</li>`;
                }
                str += "</ul>";
                det.html(str);
                det.show();
            });
        }
    });

    let clicked = false;
    let size_init = 1;
    //qaund on change le selecteur on change aussi le prix
    $('.prod_size').click(function () {
        //premier click on enregistre la taille de la pizza
        if (clicked == false) {
            var prod_price = parseInt($(this).parent().find('.prod_price').text());
            size_init = $(this).val();
            clicked = !clicked;
        }
        //deuxieme click on change le prix selon la taille de la pizza
        else {
            prod_price = parseInt($(this).parent().find('.prod_price').text());
            switch (size_init) {
                case "M":
                    if ($(this).val() == "L") {
                        prod_price = prod_price + 2;
                    }
                    else if ($(this).val() == "XL") {
                        prod_price = prod_price + 4;
                    }
                    break;
                case "L":
                    if ($(this).val() == "M") {
                        prod_price = prod_price - 2;
                    }
                    else if ($(this).val() == "XL") {
                        prod_price = prod_price + 2;
                    }
                    break;
                case "XL":
                    if ($(this).val() == "M") {
                        prod_price = prod_price - 4;
                    }
                    else if ($(this).val() == "L") {
                        prod_price = prod_price - 2;
                    }
                    break;
            }
            $(this).parent().find('.prod_price').text(prod_price + ' €');
            clicked = !clicked;
        }
    });

    //on choisit la taille 
    $('.pizza_size').click(function () {
        $(this).parent().find('.pizza_size').removeClass('active');
        $(this).addClass('active');
    });

    add_to_card = function (produit) {
        $.post("http://localhost:8080/add", { prod: produit }, function (data) {
            str = "";
            total = data.total;
            products = data.panier;
            for (let i = 0; i < products.length; i++) {
                str += `<li id=${i}> ${add_compose(products[i])}<span class="prod_name">` + products[i].product_name +
                    '</span> <span class="prod_size">' + (products[i].product_size === undefined ? "" : products[i].product_size) +
                    '</span><span class="prod_price">' +
                    products[i].product_price + "€" +
                    '</span><span class="prod_id">' + products[i].product_id +
                    '</span><button class="remove btn-danger bi bi-trash"></button>' +
                    "</li> " + `${add_compose_details(products[i])}`;
            }
            $("#commande").html(str);
            $('.prod_id').hide();
            $('.details').hide();
            $(".total").html(total + " €");
        });
    }


    //quand on clique sur le bouton ajouter au panier
    $('.add').click(function () {
        //on recupere les données de la pizza
        var size = $(this).parent().find('.prod_size').val();
        if ($(this).parent().find('.prod_type').text().trim() == "boisson") {
            size = $(this).parent().find('.prod_size').text().trim();
        }
        var produit = {
            product_type: $(this).parent().find('.prod_type').text().trim(),
            product_name: $(this).parent().find('.prod_name').text().trim(),
            product_price: parseInt($(this).parent().find('.prod_price').text()),
            product_size: size,
            product_id: ($(this).parent().find('.perso_id').text()).trim(),
            product_sauce: $(this).parent().find('.prod_sauces').val(),
        };
        //on les ajoute au panier
        // j'ai enlevé prod_id car on l'utilise que por les pizza composées(pour l'instant à voir si on garde ou pas)
        add_to_card(produit);
    });

    $('body').on('click', '.remove', function () {
        //on recupere les données de la pizza
        // recuperer le id 
        id = $(this).parent().attr('id');
        $.post("http://localhost:8080/remove", { idToRemove: id }, function (data) {
            str = "";
            total = data.total;
            products = data.panier;
            for (let i = 0; i < products.length; i++) {
                str += `<li id=${i}> ${add_compose(products[i])}` + '<span class="prod_name">' + products[i].product_name +
                    '</span> <span class="prod_size">' + (products[i].product_size === undefined ? "" : products[i].product_size) +
                    '</span><span class="prod_price">' +
                    products[i].product_price + "€" +
                    '</span><span class="prod_id">' + products[i].product_id +
                    '</span><button class="remove btn-danger bi bi-trash"></button>' +
                    "</li>" + add_compose_details(products[i]);
            }
            $("#commande").html(str);
            $('.prod_id').hide();
            $(".details").hide();
            $(".total").html(total + " €");

        });
    });

    //description des pizzas(les ingredients)
    function getProdDescription(elt) {
        var prod_name = elt.parent().find('.prod_name').text().trim();
        if (elt.parent().find('.descr').text().length !== 0) {
            elt.parent().find('.descr').show(750);
        }
        else {
            $.post("/get_prod_description", { name: prod_name }, function (data) {
                var str = "<i>";
                prod_description = data.result;
                str += prod_description[0];
                for (let i = 1; i < prod_description.length; i++) {
                    str += ', ' + prod_description[i];
                }
                str += "</i>";
                elt.parent().find('.descr').html(str);
                elt.parent().find('.descr').show(750);
            });
        }
    }

    // finaliser la commande
    $('#validate').click(function () {
        if ($("#validate .total").text().trim() === "0 €") {
            alert("Votre panier est vide");
            return;
        }
        $.get("/clientInformations", function (data) {
            window.location.href = "/clientInformations";
        });
    });

    function add_compose(elt) {
        var str = "";
        if (elt.product_type === 'Perso') {
            str += '<button class="dropdown-toggle" type="button" id="dropdownMenuButton"' +
                'data - toggle="dropdown" aria - haspopup="true" aria - expanded="false" ></button > ';
        }
        return str;
    }

    function add_compose_details(elt) {
        var str = "";
        if (elt.product_type === 'Perso') {
            str += '<div class="details"> le detail de la</div > ';

        }
        return str;
    }

    $("#contact").click(function () {
        alert("Le message a été bien envoyé");
    });

});