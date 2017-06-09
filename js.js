//массив основных блюд
var gamburgers = {
    'Гамбургер маленький' : {
                'cost' : 17,
                'ccal' : 250,
                'id' : 123
                },
    'Гамбургер большой' : {
                'cost' : 25,
                'ccal' : 340,
                'id' : 124
            }
};
//массив дополнений к основным блюдам
var optionalMustHave = {
    'сыр' : {
        'cost' : 4,
        'ccal' : 25,
        'id' : 'op1'
    },
    'салат' : {
        'cost' : 5,
        'ccal' : 5,
        'id' : 'op2'
    },
    'ветчина' : {
        'cost' : 10,
        'ccal' : 50,
         'id' : 'op3'
    }
};
//массив необязательных дополнений
var optional = {
    'соус' : {
        'cost' : 5,
        'ccal' : 0,
        'id' : 'op3'
    },
    'майонез' : {
        'cost' : 4,
        'ccal' : 10,
        'id' : 'op4'
    }
};
//массив для вывода информации в чек и localStOrders для сумм, которые мы потом добавляем в localStorage
var order = {
    'sum' : 0,
    'ccal' : 0,
    'items' : [],
    'out' : '',
    'localStOrders':[]
};
function addOption(mass,place) {
    for (var key in mass) {
        $('<input/>', {
            id: mass[key].id,
            class: 'optItem',
            value: key,
            type: 'checkbox',
            'data-ccal' : mass[key].ccal,
            'data-cost': mass[key].cost,
        }).appendTo(place);
        $('<label/>', {
            for: mass[key].id,
            text: key+', '+ mass[key].cost + 'грн., '+mass[key].ccal+'ккал'
        }).appendTo(place);
    };
};
//функция отрисовки меню на странице
function renderItems() {
    for(var key in gamburgers) {
        $('<input/>', {
            id: gamburgers[key].id,
            class: 'gambItem',
            name: 'main-food',
            value: key,
            'data-ccal' : gamburgers[key].ccal,
            'data-cost': gamburgers[key].cost,
            type: 'radio'
        }).appendTo('#gamb');
        $('<label/>', {
            for: gamburgers[key].id,
            text: key+', '+ gamburgers[key].cost + 'грн., '+gamburgers[key].ccal+'ккал'
        }).appendTo('#gamb');
    };
    $('<p/>', {
        class: 'helper',
        text: 'Обязательные дополнения:'
    }).appendTo('#optional2');
    addOption(optionalMustHave,'#optional2');
    $('<p/>', {
        class: 'helper',
        text: 'Не обязательные дополнения:'
    }).appendTo('#optional');
    addOption(optional,'#optional');

};

renderItems();
//функция отображения списка заказанной еды+сумма+калории
function addFood() {
    if ($('#optional2 input:checked').length == 0) {
        $('#out').append('<p class="mistake">Нужно выбрать минимум одно обязательное дополнение</p>');
        return false;
    };
    if ($('input:checked').length > 0) {
        delOrder();
        console.log($('input:checked'));
    $('input:checked').map( function (index,el) {
        order.sum = order.sum + Number($(el).attr('data-cost'));
        order.ccal = order.ccal + Number($(el).attr('data-ccal'));
        order.items.push($(el).attr('value'));} );

    console.log(order);
    order.out+='<br><p><b>Состав заказа:</b></p><ol>';
    for (var i=0; i<order.items.length; i++) {
        order.out+='<li>'+order.items[i]+'</li>';
    }
    order.out+='</ol><br>';
    order.out+='<p><b>Cумма заказа: </b>'+order.sum+'</p>';
    order.out+='<p><b>Всего калорий: </b>'+order.ccal+'</p>';
    $('#out').append(order.out);
    $('#gamb').empty();
    $('#optional').empty();
    $('#optional2').empty();
    renderItems();} else {
        $('#out').append('<p class="mistake">Вы не выбрали ни одного блюда</p>');
    }
};
//обнуление данных по чеку
function delOrder() {
    order.sum = 0;
    order.ccal = 0;
    order.items = [];
    order.out = '';
    $('#out').empty();
    $('input').attr('checked',false);
};
//функция добавления данных в localStorage
function toLocalStorage() {
    order.localStOrders.push(order.sum);
    var serialObj = JSON.stringify(order.localStOrders);
    localStorage.setItem('order',serialObj);
    delOrder();
// catch (e) {
//         if (e == QUOTA_EXCEEDED_ERR) {
//             alert('Превышен лимит');
//         }
//     }
}
//функция вычисления средней суммы чеков по данным из localStorage
function middleOrder() {
    $('#mid').empty();
    var returnObj = JSON.parse(localStorage.getItem('order'));
    var sumLs=0;
    console.log(returnObj);
    for (var i=0; i<returnObj.length; i++) {
        sumLs=sumLs+returnObj[i];
    }
    var out=sumLs/returnObj.length;
    $('<p/>', {
        text: 'Средняя сумма чека: '+out,
    }).appendTo('#mid');
}

$('#addFood').on('click',addFood);


$('#delOrder').on('click',delOrder);
$('#pay').on('click',toLocalStorage);

$('#middle-order').on('click',middleOrder);