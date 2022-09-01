
(async () => {
    const result = await fetch("http://localhost:3000/api/products");
    const value = await result.json();
    const parent = document.getElementById("items");

    for (let apiProduct of value) {

        const newAnchorLink = document.createElement("a");
        newAnchorLink.href = `../html/product.html?id=${apiProduct._id}`;
        parent.appendChild(newAnchorLink);

        const newArticle = document.createElement('article');

        const newImage = document.createElement('img');
        newImage.src = apiProduct.imageUrl;
        newImage.alt = apiProduct.altTxt;

        const newTitle = document.createElement("h3");
        newTitle.innerText = apiProduct.name;
        newTitle.classList.add('productName');

        const newText = document.createElement("p");
        newText.innerText = apiProduct.description;
        newText.classList.add('productDescription');

        newAnchorLink.appendChild(newArticle)
        newArticle.appendChild(newImage)
        newArticle.appendChild(newTitle)
        newArticle.appendChild(newText)

    }


})();