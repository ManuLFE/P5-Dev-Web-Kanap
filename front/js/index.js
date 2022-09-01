
(async () => {
    const result = await fetch("http://localhost:3000/api/products");
    const value = await result.json();
    const parent = document.getElementById("items");

        for (let i=0; i < value.length; i++) {

            const newAnchorLink = document.createElement("a");
            newAnchorLink.href = `../html/product.html?id=${value[i]._id}`;
            parent.appendChild(newAnchorLink);

            const newArticle = document.createElement('article');

            const newImage = document.createElement('img');
            newImage.src = `/back/images/kanap0${i+1}.jpeg`;
            newImage.alt = `${value[i].altTxt}`;

            const newTitle = document.createElement("h3");
            newTitle.innerText = value[i].name;
            newTitle.classList.add('productName');

            const newText = document.createElement("p");
            newText.innerText = value[i].description;
            newText.classList.add('productDescription');

            newAnchorLink.appendChild(newArticle)
            newArticle.appendChild(newImage)
            newArticle.appendChild(newTitle)
            newArticle.appendChild(newText)
        }

})();