//Récupération des projets et affichage dans le DOM
//le paramètre attendu est un entier correspondant à l'ID de la catégorie souhaitée
//par defaut, categorieID = 0. Affichage de tous les projets si aucune valeur n'a été renseignée
async function appendCategoriesAndWorks(categorieID = 0) {
    //récupération des travaux sur le serveur
    const worksResponse = await fetch("http://localhost:5678/api/works");
    const worksJson = await worksResponse.json();

    //Récupération des catégories sur le serveur
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    const categoriesJson = await categoriesResponse.json();

    //reinitialisation des catégories
    const categoriesClass = document.querySelector(".categories");
    categoriesClass.innerHTML = "";

    //ajout des catégories dans la barre de filtre
    appendCategorie(categoriesClass, {id: 0, name: 'Tous'});
    let i = 0;
    while (i < categoriesJson.length) {
        appendCategorie(categoriesClass, categoriesJson[i]);
        i++;
    };
    
    //reinitialisation de la galerie
    const galleryClass = document.querySelector(".gallery");
    galleryClass.innerHTML = "";

    //ajout des projets dans la galerie
    i = 0;
    while (i < worksJson.length) {
        if (worksJson[i].category.id == categorieID || categorieID == 0) {
            appendWork(galleryClass, worksJson[i]);
        }
        i++;
    };

    /************************ Récupérer les catégories et mettre en place la barre de filtre ************************/
    //dans le JSON, les projets sont classés par catégories identifiables par un ID dans la propriété "categoryId"
    //faire un fetch sur l'adresse http://localhost:5678/api/categories afin de récupérer les catégories classées par ID
    //j'affiche ensuite les catégories sous forme de boutons filtres. Exemple : | Tous | categoryId | categoryId | categoryId | ... |
    //j'affiche ensuite les projets de la catégorie filtrée
};

//function permettant l'ajout d'un projet dans la galerie
function appendWork(gallery, work) {
    //déclaration des éléments à ajouter dans la galerie
    let figureElement = document.createElement("figure");
    let imageElement = document.createElement("img");
    let figcaptionElement = document.createElement("figcaption");

    //définition du contenu des éléments
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    figcaptionElement.innerHTML = work.title;

    //ajout des éléments image et figcaption dans l'élément figure
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);

    //ajout des éléments dans la galerie
    gallery.appendChild(figureElement);
};

//function permettant l'ajout d'une catégorie dans la barre de filtre
function appendCategorie(filterbar, categorie) {
    //déclaration des éléments à ajouter dans la barre de filtre
    let pElement = document.createElement("p");
    let divElement = document.createElement("div");

    //définition du contenu des éléments
    pElement.innerHTML = categorie.name;
    divElement.className = "button";
    divElement.addEventListener("click",  () => {
        appendCategoriesAndWorks(categorie.id);
    });

    //ajout de l'élément p dans l'élément div
    divElement.appendChild(pElement);
    
    //ajout des éléments dans la barre de filtre
    filterbar.appendChild(divElement);
};

appendCategoriesAndWorks();