async function getUsers(){
    return await request("getUsers", {"session_id": getCookie("sessionadmin")});
}

async function deleteUser(user_id){
    return await request("deleteUser", {"session_id": getCookie("sessionadmin"), "user_id": user_id});
}

async function setUserFunds(user_id, funds){
    return await request("setUserFunds", {"session_id": getCookie("sessionadmin"), "user_id": user_id, "funds": funds});
}



async function getItems(){
    return await request("getItems", {"session_id": getCookie("sessionadmin")});
}

async function getItemCategories(){
    return await request("getItemCategories", {"session_id": getCookie("sessionadmin")});
}

async function newItem(name, image, price, category_id, description){
    let formData = new FormData();
    formData.append("session_id", getCookie("sessionadmin"));
    formData.append("name", name);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("category_id", category_id);
    formData.append("description", description);
    return await requestMultipart("newItem", formData);
}

async function updateItem(id, name, price, category_id, description){
    return await request("updateItem", {"session_id": getCookie("sessionadmin"),"id": id, "name": name, "price": price, "category_id": category_id, "description": description});
}

async function deleteItem(id){
    return await request("deleteItem", {"session_id": getCookie("sessionadmin"), "id": id});
}
