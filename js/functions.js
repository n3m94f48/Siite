function localHref(link){
    window.location.href = window.location.origin +  "/" + link;
}

async function addToCart(item_id){
    let cart_id = getCookie("cartid");
    let items_count = getCookie("cartitemscount");
    if(cart_id === null){
        cart_id = await newCart();
        items_count = 0;
        document.cookie = "cartid=" + cart_id + "; max-age=31536000";
    }
    await cartAddItem(cart_id, item_id);
    document.cookie = "cartitemscount=" + (parseInt(items_count) + 1) + "; max-age=31536000";
    document.body.dispatchEvent(new CustomEvent("cartItemAdded"));
}

async function removeFromCart(item_id){
    let cart_id = getCookie("cartid");
    let items_count = getCookie("cartitemscount");
    if(cart_id === null){
        return;
    }
    await cartRemoveItem(cart_id, item_id);
    document.cookie = "cartitemscount=" + (parseInt(items_count) - 1) + "; max-age=31536000";
    document.body.dispatchEvent(new CustomEvent("cartItemRemoved"));
}

async function signOutAndExit(){
    await signOut();
    document.cookie = "sessionid=;max-age=0";
    document.cookie = "cartid=;max-age=0";
    document.cookie = "cartitemscount=;max-age=0";
    window.location.replace(window.location.href = window.location.origin + "/index.html");
}