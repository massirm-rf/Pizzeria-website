$(document).ready(function () {


    window.onload = function () {
        $('.descr').hide();
        $("#id_livreur").hide();
        $(".details").hide();
    }
    window.onload();

    $('.det').on('click', function () {
        det = $(this).parent().next();
        // det.toggle();
        if (det.css('display') !== 'none') {
            det.hide();
        }
        else {
            perso_id = $(this).parent().attr('id');
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
        // 
    });

    $(".det_entree").on('click', function () {
        det = $(this).parent().next();
        det.toggle();
    });

    $('#dispatch').on('click', function () {
        id_livreur = $('#id_livreur').text().trim();
        id_commande = $('#id_commande').text();
        $.post("/dispatch", { id_commande: id_commande, id_livreur: id_livreur }, function (data) {
            $.post("/livraison", { identifiant: id_livreur }, function (data) {
                location.reload();
            })
        });
    });

    $("#done").on('click', function () {
        id_commande = $('#id_commande').text();
        id_livreur = $('#id_livreur').text().trim();
        // console.log(id_commande);
        $.post("/done", { id_commande: id_commande }, function (data) {
            $.post("/livraison", { identifiant: id_livreur }, function (data) {
                location.reload();
            });
        });
    });
});


