const categoryHTML = (categories, selected)=>{
    let html = "";
    for(let category of categories){
        html += `<option value="${category.id}" ${category.id == selected ? "selected" : ""}>${category.name}</option>`;
    }
    return "<select>" + html + "</select>";
}

document.addEventListener("DOMContentLoaded", async function(){
    const main = document.querySelector("main");
    const form = document.querySelector("main form");
    const name = document.getElementById("name");
    const image = document.getElementById("image");
    const price = document.getElementById("price");
    const category_id = document.getElementById("category_id");
    const description = document.getElementById("description");

    const categories = await getItemCategories();

    category_id.innerHTML = categoryHTML(categories, 1);
    
    form.onsubmit = async (evt) => {
        evt.preventDefault();

        main.style.pointerEvents = "none";

        name.classList.remove("is-invalid");
        image.classList.remove("is-invalid");
        price.classList.remove("is-invalid");

        if(name.value == ''){
            name.classList.add("is-invalid");
            return;
        }
        if(image.files.length !== 1){
            image.classList.add("is-invalid");
            return;
        }
        if(price.value == ''){
            price.classList.add("is-invalid");
            return;
        }
        await newItem(name.value, image.files[0], price.value, category_id.value, description.value);

        main.style.pointerEvents = "";
      }
})