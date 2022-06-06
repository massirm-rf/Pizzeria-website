
$(document).ready(function () {

    // let current_window = $('#pizza_size');

    let perso_id = 0;
    let perso_selected = false;
    let base_selected = false;
    let nb_ing = 0;
    var init_price = 0;

    window.onload = function () {
        $("#base_pizza").hide();
        $("#ingredients").hide();
        $("#piz_size").hide();
        $("#piz_base").hide();
        $(".ing_price").text(" (Gratuit) ");
    }
    window.onload();

    $("img").mouseover(function () {
        $(this).css("border", "solid 2px ");
    });
    $("img").mouseout(function () {
        $(this).css("border", "5px solid rgb(255, 246, 246)");
    });

    $("img").click(function () {
        $(this).css("border", "solid 2px ");
    });

    $("#pizza_size").click(function () {
        $(this).hide();
        $("#base_pizza").show();
    });
    $('#base_pizza').click(function () {
        $(this).hide();
        $("#ingredients").show();
    });



    $(".perso_size").click(function () {
        if (perso_selected) return;
        let str = $('#compose').html();
        size = $(this).find('.size').text();
        price = $(this).find('.price_from').text();
        init_price = parseInt(price);

        $.post("http://localhost:8080/perso_size", { size: size, price: price }, function (data) {
            perso_id = data.result;
            $('#size').text(size);
            $('#piz_size').show();
            $('#validate .total').text(price);
            perso_selected = true;
        });
    });

    $(".perso_base").click(function () {
        base = $(this).find('.base_name').text().trim();
        if (!base_selected) {
            $.post("http://localhost:8080/add_perso_ing", { ingredient: base, id: perso_id, quantity: 1 }, function (data) {
                nb_ing = nb_ing + 1;
                $('#base').text(base);
                $('#piz_base').show();
            });
            base_selected = true;
        }
        else {
            let base_to_replace = $('#base').text();
            $.post("http://localhost:8080/remove_perso_ing", { ingredient: base_to_replace, id: perso_id, quantity: 1 }, function (data) {
                nb_ing = nb_ing - 1;
                $('#base').text(base);
                $('#piz_base').show();
                $.post("http://localhost:8080/add_perso_ing", { ingredient: base, id: perso_id, quantity: 1 }, function (data) {
                    nb_ing += 1;
                });
            });
        }
    });

    $(".add").click(function () {
        let str = $('#compose').html();
        ingredient = $(this).parent().find('.ing_name').text().trim();
        quantity = parseInt($(this).parent().find('.quantity').val());
        if ((quantity + nb_ing) > 7) {
            alert("Vous ne pouvez pas ajouter plus d'ingrédients");
        }
        else {
            $.post("http://localhost:8080/add_perso_ing", { ingredient: ingredient, id: perso_id, quantity: quantity }, function (data) {
                nb_ing = nb_ing + quantity;
                $('#compose').html(str + '<li>Ingredient: <span class="qnt">' + quantity + '</span> x <span class"ing_name">' + ingredient + '</span>  <button class="remove btn-danger bi bi-trash"></button></li>');
                console.log('add', nb_ing);
                if (nb_ing > 3) {
                    $(".ing_price").text('1.5 €');
                }
                get_total();
            });

        }


    });

    $("body").on("click", ".remove_base", function () {
        $("#ingredients").hide();
        $("#base_pizza").show();
        let base_to_replace = $(this).parent().find('#base').text();
        $('#piz_base').hide();
        // $.post("http://localhost:8080/remove_perso_ing", { ingredient: base_to_replace, id: perso_id, quantity: 1 }, function (data) {
        // });f
    });

    $("body").on("click", ".edit_size", function () {
        $('#validate .total').text('');
        $("#piz_size").hide();
        $("#ingredients").hide();
        $("#base_pizza").hide();
        $("#pizza_size").show();
        let size_to_replace = $(this).parent().find('#size').text();
        $('#piz_size').hide();
        $(".perso_size").click(function () {
            size = $(this).find('.size').text();
            price = $(this).find('.price_from').text();
            init_price = parseInt(price);
            // pr = ((nb_ing - 4));
            // if (pr > 0) {
            //     $('#validate .total').text(init_price + ((nb_ing - 4) * 1.5));
            // }
            get_total()
            $.post("http://localhost:8080/edit_size", { id: perso_id, last_size: size_to_replace, new_size: size, price: price }, function (data) {
                // perso_id = data.result;
                $('#size').text(size);
                $('#piz_size').show();
                let base_to_replace = $('#base').text();
                $('#piz_base').hide();
                // $.post("http://localhost:8080/remove_perso_ing", { ingredient: base_to_replace, id: perso_id, quantity: 1 }, function (data) {
                // });
            });
        });
    });

    $('body').on('click', '.remove', function () {
        let ingredient_to_remove = $(this).prev().text();
        let qnt = $(this).parent().find('.qnt').text();
        $(this).parent().remove();
        $.post("http://localhost:8080/remove_perso_ing", { ingredient: ingredient_to_remove, id: perso_id, quantity: qnt }, function (data) {
            nb_ing = nb_ing - qnt;
            //suprimer le parent de la dom
            if (nb_ing < 4) {
                $(".ing_price").text('(Gratuit)');
            }
            get_total();
        });
    });

    function get_total() {
        pr = ((nb_ing - 4));
        if (pr >= 0) {
            $('#validate .total').text(init_price + ((nb_ing - 4) * 1.5));
        }
        else {
            $('#validate .total').text(init_price);
        }
    }

    $('#validate').click(function () {
        total = parseInt($('#validate .total').text());
        size = $('#size').text().trim();
        var produit = {
            product_type: 'Perso',
            product_name: "Composé",
            product_price: parseInt($('#validate .total').text()),
            product_size: $('#size').text().trim(),
            product_id: perso_id,
            product_sauce: $(this).parent().find('.prod_sauces').val(),
        };
        $.post("http://localhost:8080/add_perso_to_cart", { perso: produit }, function (data) {
            window.location.href = "http://localhost:8080/pizzas";

        });
        obj = {
            id: perso_id,
            size: size,
            price: total,
        };
    });
});
