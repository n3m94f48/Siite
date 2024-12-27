const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id');

const itemHTML = (props)=>{
    return `
        <div id="item-wrapper" class="d-flex">
            <div style="height: 25pc; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div class="img" style="width: 600px; height: 400px; background-image: url(${window.location.origin}/${props.image}); background-color: white; border-radius: 0.5rem; margin: 0.5rem;"></div>
                <div class="details">
                    <p style="font-size: 18px;">Цена: ${props.price} руб.</p>
                </div>
            </div>
            <p style="padding-top: 30px; font-size: 18px;">${props.description}</p>
        </div>`;
}

const reviewHTML = (props)=>{
    return `
        <div class="review">
            <h6 class="review-author">Автор: ${props.user.username}</h6>
            <p class="review-text">${props.text}</p>
        </div>`;
}

async function loadReviews(itemProps){
    const item = parseHTML(itemHTML(itemProps));

    document.getElementById("item-wrapper").replaceWith(item);

    let reviews = await getItemReviews(itemProps.id);
    let reviewsHTML = ""
    for(let reviewProps of reviews){
        reviewsHTML += reviewHTML(reviewProps);
    }

    document.querySelector("#reviews-wrapper .reviews-col").replaceChildren(...parseHTMLMulti(reviewsHTML));
}

document.addEventListener("DOMContentLoaded", async function (){
    let itemProps = await getItem(itemId);

    document.title = itemProps.name;
    document.getElementById("item_name").innerText = itemProps.name;

    loadReviews(itemProps);

    let textarea = document.getElementById("review_textarea");
    let submit = document.getElementById("post_review_btn");

    submit.onclick = async ()=>{
        if(textarea.value == ""){return;}

        submit.disabled = true;

        await addReview(itemProps.id, textarea.value);
        textarea.value = "";
        await loadReviews(itemProps);

        submit.disabled = false;
    };
});