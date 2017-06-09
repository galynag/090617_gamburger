var gamburgers = {
    'маленький' : {
                'cost' : 17,
                'ccal' : 250,
                'id' : 123
                },
    'большой' : {
                'cost' : 25,
                'ccal' : 340,
                'id' : 124
            }
};

var optional = {
    'сыр' : {
        'cost' : 4,
        'ccal' : 25,
        'mustHave' : true,
        'id' : 'op1'
    },
    'салат' : {
        'cost' : 5,
        'ccal' : 5,
        'mustHave' : true,
        'id' : 'op2'
    },
    'ветчина' : {
        'cost' : 10,
        'ccal' : 50,
        'mustHave' : true,
        'id' : 'op3'
    },
    'соус' : {
        'cost' : 5,
        'ccal' : 0,
        'mustHave' : false,
        'id' : 'op3'
    },
    'майонез' : {
        'cost' : 4,
        'ccal' : 10,
        'mustHave' : false,
        'id' : 'op4'
    }
};

var order = {
    'sum' : 0,
    'ccal' : 0,
    'items' : [],
    'out' : '',
    'localStOrders':[]
};


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
            text: 'Гамбургер '+key+', '+ gamburgers[key].cost + 'грн., '+gamburgers[key].ccal+'ккал'
        }).appendTo('#gamb');
    }
    for (var key in optional) {
        $('<input/>', {
            id: optional[key].id,
            class: 'optItem',
            value: key,
            type: 'checkbox',
            'data-ccal' : optional[key].ccal,
            'data-cost': optional[key].cost,

        }).appendTo('#optional');
        $('<label/>', {
            for: optional[key].id,
            text: ((optional[key].mustHave == true) ? '* ':'')+key+', '+ optional[key].cost + 'грн., '+optional[key].ccal+'ккал'
        }).appendTo('#optional');
    }
    $('<p/>', {
        text: '* нужно обязательно выбрать хотя бы одно дополнение, отмеченное *'
    }).appendTo('#optional');
}
renderItems();

function addFood() {

    $('input:checked').map( function (index,el) {
        order.sum = order.sum + Number($(el).attr('data-cost'));
        order.ccal = order.ccal + Number($(el).attr('data-ccal'));
        order.items.push($(el).attr('value'));} );

    console.log(order);
    order.out+='<p><b>Состав заказа:</b></p><ol>';
    for (var i=0; i<order.items.length; i++) {
        order.out+='<li>'+order.items[i]+'</li>';
    }
    order.out+='</ol>';
    order.out+='<p><b>Cумма заказа: </b>'+order.sum+'</p>';
    order.out+='<p><b>Всего калорий: </b>'+order.ccal+'</p>';
    $('#out').append(order.out);
    $('#gamb').empty();
    $('#optional').empty();
    renderItems();
};
function delOrder() {
    order.sum = 0;
    order.ccal = 0;
    order.items = [];
    order.out = '';
    $('#out').empty();
    $('input').attr('checked',false);
};

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

// $('#delOrder').on('click',delOrder);
$('#pay').on('click',toLocalStorage);

$('#middle-order').on('click',middleOrder);