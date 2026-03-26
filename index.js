import menuArray from './data.js'

// Get html elements
const menuEl = document.getElementById('menu')
const orderContainerEl = document.getElementById('order-container')
const order = document.getElementById('order')
const modal = document.getElementById('modal-dialog')
const paymentForm = document.getElementById('payment-modal')

// Global variables
const orderSummary = []

// Event listeners
menuEl.addEventListener('click',function(e){
    const btn = e.target.closest('.btn-add')
    if(btn){
        const itemId = btn.parentElement.dataset.id
        const items = addItem(itemId)
        orderContainerEl.innerHTML = renderOrder(items)
    } 
    if(orderSummary.length>0){
        order.classList.remove('hidden')
    }
})

orderContainerEl.addEventListener('click',function(e){
    const btnRemove = e.target.closest('.btn-remove-item')
    if(btnRemove){
        const itemId = (btnRemove.closest('.order-item').dataset.id)
        const items = removeItem(itemId)
        orderContainerEl.innerHTML = renderOrder(items)
        if(orderSummary.length<1){
            order.classList.add('hidden')
        }      
    }
    const btnSubmitOrder = e.target.closest('.btn-submit-order')
    if(btnSubmitOrder){
        submitOrder()
    }
})


modal.addEventListener('click',function(e){
    const rect = modal.getBoundingClientRect()
    const isInDialog = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
    )

    if(!isInDialog){
        modal.close()
    }
})


paymentForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevents the default full page reload
  const formData = new FormData(e.target);
  // Access values:
  const name = formData.get('fullName')
  
  order.innerHTML = `
    <div class="thank-you-container">
        <p>Thanks, ${name}! Your order is on its way!</p>
    </div>
    `
  modal.close()
  orderSummary.length = 0
})

// Functions
function addItem(itemId) {
        const existingItem = orderSummary.find(item => item.id.toString() === itemId)     
        if(existingItem) {
            existingItem.qty++
        }
        else {
            const targetMenuItem = menuArray.find(item => item.id.toString() === itemId)
            if (targetMenuItem) {
                targetMenuItem.qty = 1;
                orderSummary.push(targetMenuItem);
            }
        }
        return orderSummary
}

function removeItem(itemId) {
        const idx = orderSummary.findIndex(item => item.id.toString() === itemId)

        if (idx === -1) return orderSummary

        const existingItem = orderSummary[idx]

        if(existingItem.qty > 1){
            existingItem.qty--
            }      
        else {
            orderSummary.splice(idx, 1)
        }
        return orderSummary
}

function calculateOrderTotal(order){
    const orderTotal = order.reduce((total, item) => {
        return total + (item.price * item.qty)
    },0)
    return orderTotal
}


function renderOrder(order){
    const orderGrandTotal = calculateOrderTotal(order)

    const orderItemsHtml = order.map(function(item){
        const {id, itemName, qty, price} = item
        const itemSubtotal = qty*price

    return `
        <div class='order-item' data-id='${id}'>
            <div class='order-item-title-container'>
                <h2 class='order-item-title'>${itemName}</h2>
                <button class='btn-remove-item'>remove</button>
            </div>
            <div class='order-item-subtotal-container'>
                <p class='order-item-qty'>Qty: ${qty}</p>
                <p class='order-item-subtotal'>$${itemSubtotal}</p>
            </div>
        </div>
    `
    }).join('')

    return `
        <div class='order-summary'>
            <div class='order-items'>${orderItemsHtml}</div>
            <div class='order-total-container'>
                <h2 class='order-total-txt'>Total Price:</h2>
                <p class='order-total'>$${orderGrandTotal}</p>
            </div>
            <button class='btn-submit-order' id='btn-submit-order'>Complete order</button>
        </div>
    `
}

function submitOrder() {
    modal.showModal()
}


function renderMenu(menuArr){
    return menuArr.map(function(menuObj){
        let {id, imgPath, itemName, ingredients, price} = menuObj
        return `
        <div class='menu-item' data-id='${id}'>
            <img class="item-img" src='${imgPath}' alt='Icon for ${itemName}'>
            <div class='item-details'>
                <h2 class='item-title'>${itemName}</h2>
                <p class='item-ingredients'>${ingredients}</p>
                <p class='item-price'>$${price}</p>
            </div>
            <button class="btn-add">+</button>
        </div>
        `
     }
    ).join('')
}



menuEl.innerHTML = renderMenu(menuArray)