async function signOut(){
    return await request("signOut", {"session_id": getCookie("sessionid")});
}

async function getMe(){
    return await request("getMe", {"session_id": getCookie("sessionid")});
}

async function editAboutMe(text){
    return await request("editAboutme", {"session_id": getCookie("sessionid"), "text": text});
}



async function getItems(category_id){
    return await request("getItems", {"session_id": getCookie("sessionid"), "category_id": category_id});
}

async function getCategories(){
    return await request("getCategories", {"session_id": getCookie("sessionid")});
}

async function getCategory(id){
    return await request("getCategory", {"session_id": getCookie("sessionid"), "category_id": id});
}

async function getItem(id){
    return await request("getItem", {"session_id": getCookie("sessionid"), "item_id": id});
}

async function getItemReviews(id){
    return await request("getItemReviews", {"session_id": getCookie("sessionid"), "item_id": id});
}



async function addReview(item_id, text){
    return await request("addReview", {"session_id": getCookie("sessionid"), "item_id": item_id, "text": text});
}



async function newCart(){
    return (await request("newCart", {"session_id": getCookie("sessionid")}))["new_cart_id"];
}

async function cartAddItem(cart_id, item_id){
    return await request("cartAddItem", {"session_id": getCookie("sessionid"), "cart_id": cart_id, "item_id": item_id});
}

async function cartRemoveItem(cart_id, item_id){
    return await request("cartRemoveItem", {"session_id": getCookie("sessionid"), "cart_id": cart_id, "item_id": item_id});
}

async function cartUpdateQuantity(cart_id, item_id, quantity){
    return await request("cartUpdateQuantity", {"session_id": getCookie("sessionid"), "cart_id": cart_id, "item_id": item_id, "quantity": quantity});
}

async function getCartItems(cart_id){
    return await request("getCartItems", {"session_id": getCookie("sessionid"), "cart_id": cart_id});
}

async function purchaseCart(cart_id){
    return await request("purchaseCart", {"session_id": getCookie("sessionid"), "cart_id": cart_id});
}

async function getOrders(){
    return await request("getOrders", {"session_id": getCookie("sessionid")});
}