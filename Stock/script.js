/** Things to add
 * 
 * sort stock by date
 * manage past and future sales using date
 * show stock in pending
 * calculate profit
 * change layout
 * add regex to stop spaces and special characters in product name
 * manage product variants
 * multiple warehouse
 * total, in hand, free to use, ingoing, outgoing  stock
 * edit after entry (delayed etc)
 * 
 * use object constructor
 */

var comingQty = document.getElementById('comingQty')
var comingPrice = document.getElementById('comingPrice')
var comingNote = document.getElementById('comingNote')
var goingQty = document.getElementById('goingQty')
var goingPrice = document.getElementById('goingPrice')
var goingNote = document.getElementById('goingNote')
var comingProduct = document.getElementById('comingProduct')
var goingProduct = document.getElementById('goingProduct')        
var goingDate = document.getElementById('goingDate')
var comingDate = document.getElementById('comingDate')
var stockDiv = document.getElementById('stockDiv')
var itemStockDivHtml = ''
var itemStockTableHtml = ''
let index = 0;
var products = [];
var productStockTotal = {};
var productStockDetail = {};
var updateProduct = '';
var oldProduct = '';
updateDate();

function displayProduct(){
    debugger;
    if(oldProduct != ''){document.getElementById(oldProduct +`StockDiv`).hidden = true}
    var currentProduct = document.getElementById('productSelect').value;
    document.getElementById(currentProduct +`StockDiv`).hidden = false;
    oldProduct = document.getElementById('productSelect').value;
}

function addProduct (){
    debugger;
    var productName =  document.getElementById('addProductInput').value;
    document.getElementById('addProductInput').value = '';
    productName = productName.trim().replace(/\s+/g, ' ');
    
    if (productName === ''){return false;}

    let duplicateProduct = products.find(product => product === productName);
    if (duplicateProduct){alert('product already exist'); return false;}

    products.push(productName);
    productStockTotal[productName] = 0;
    productStockDetail[productName] = [];
    
    renderProductTable(productName);
}

function renderProductTable(productName){
    document.getElementById('comingProduct').innerHTML += '<option>'+ productName + '</option>'
    document.getElementById('goingProduct').innerHTML += '<option>'+ productName + '</option>'
    document.getElementById('productSelect').innerHTML += '<option>'+ productName + '</option>'
    document.getElementById('stockTableBody').innerHTML +=
        `<tr> <td>${productName}</td> <td id="${productName}StockTd">0</td> </tr>`;
    
    itemStockDivHtml = `<div hidden id="${productName}StockDiv" class="itemStockDiv">
            
            <h2 class="productNameH2">${productName}</h2>
            <h2 class="productStockH2" id="${productName}StockHeading">Stock: 0</h2>
            <table>
                <thead>
                    <th style="min-width:85px; ">Date</th>
                    <th style="min-width:152px;">Notes</th>
                    <th>Coming</th>
                    <th>Going</th>
                    <th>Price</th>
                    <th style="min-width:152px;">Purchasing Amount</th>
                </thead>
                <tbody id="${productName}StockTable" class="itemStockTable"></tbody>
            </table>
        </div>`
        
    stockDiv.innerHTML += itemStockDivHtml;
}

function coming(){
    debugger;
    updateProduct = comingProduct.value;
    
    if (comingProduct.value === '' || comingQty.value === '' || comingPrice.value === ''){
        alert('incomplete details'); return false;
    }
    if (comingQty.value != Math.trunc(comingQty.value) || comingPrice.value < 1 || comingQty.value < 1){
        alert('incorrect details'); return false;
    }
    
    index += 1;
    var productStockTable = document.getElementById(comingProduct.value+`StockTable`);
    var qty = comingQty.value;
    itemStockTableHtml = 
        `<tr>
            <td>`+comingDate.value+`</td>
            <td>`+comingNote.value+`</td>
            <td id="${index}coming">`+qty+`</td>
            <td></td>
            <td>`+comingPrice.value+`</td>
            <td></td>
        </tr>`
    productStockTable.innerHTML += itemStockTableHtml;
    
    productStockTotal[comingProduct.value] += parseInt(qty);
    productStockDetail[comingProduct.value].push({quantity: parseInt(qty), price: parseInt(comingPrice.value), id: index+'coming', initialQty: qty});
    
    document.getElementById('comingForm').reset();
    renderStockTotal();
    updateDate();
}

function going(){
    debugger;
    updateProduct = goingProduct.value;

    if (goingProduct.value === '' || goingQty.value === ''){
        alert('incomplete details'); return false;
    }
    if (goingQty.value != Math.trunc(goingQty.value) || goingQty.value <1){
        alert('incorrect details'); return false;
    }
    if (goingQty.value > productStockTotal[goingProduct.value]){
        alert('not enough stock'); return false;
    }
    
    var productStockTable = document.getElementById(goingProduct.value + `StockTable`);

    while(goingQty.value > 0){
        var goingProductDetail = productStockDetail[goingProduct.value][0];
        currentStock = Math.min(goingQty.value, goingProductDetail.quantity)

        itemStockTableHtml = 
            `<tr>
                <td>`+goingDate.value+`</td>
                <td>`+goingNote.value+`</td>
                <td></td>
                <td>`+currentStock+`</td>
                <td>`+goingPrice.value+`</td>
                <td>`+ goingProductDetail.price +`</td>
            </tr>`
        productStockTable.innerHTML += itemStockTableHtml;
        productStockTotal[goingProduct.value] -= parseInt(currentStock);
        goingQty.value -= currentStock;
        goingProductDetail.quantity -= currentStock; 
        
        document.getElementById(goingProductDetail.id).innerHTML = 
            `<s>` + goingProductDetail.initialQty + `</s> ` + goingProductDetail.quantity;

        if(goingProductDetail.quantity == 0){
            productStockDetail[goingProduct.value].splice(0, 1);
        }        
    }

    renderStockTotal();
    document.getElementById('goingForm').reset();
    updateDate();

}
    
function renderStockTotal(){
    document.getElementById(updateProduct + `StockTd`).innerHTML = productStockTotal[updateProduct];
    document.getElementById(updateProduct + `StockHeading`).innerHTML = 'Stock: '+ productStockTotal[updateProduct];
}

function updateDate() {
    document.getElementById('goingDate').value = new Date().toLocaleDateString('en-CA');
    document.getElementById('comingDate').value = new Date().toLocaleDateString('en-CA');
}//by gpt  