const orderHTML = (props)=>`
    ${props.items}`;

const itemHTML = (props)=>`
    <div class="d-flex flex-row clickable" item_id="${props.id}" style="border: 1px solid black; padding: 3px; margin-bottom: 15px;">
        <p style="font-size: 19px;">${props.name} ${props.price} руб, ${props.quantity} шт</p>
    </div>`;

document.addEventListener("DOMContentLoaded", async function(){
    const main = document.querySelector("main");
    
    let orders = await getOrders();
    let ordersHTML = "";
    for(let orderProps of orders){
        let itemsHTML = "";
        let totalPrice = 0;
        for(let itemProps of orderProps.items){
            totalPrice += itemProps.price * itemProps.quantity;
            itemsHTML += itemHTML(itemProps);
        }
        orderProps.items = itemsHTML;
        orderProps.totalPrice = totalPrice;
        ordersHTML += orderHTML(orderProps);
    }

    main.replaceChildren(...parseHTMLMulti(ordersHTML));

    for(let item of main.children){
        let itemId = item.getAttribute("item_id");
        item.children[0].onclick = ()=>{ localHref("item.html?id=" + itemId); };
    }
})