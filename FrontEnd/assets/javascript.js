//Récupération des projets et affichage dans le DOM
//le paramètre attendu est un entier correspondant à l'ID de la catégorie souhaitée
//par defaut, categorieID = 0. Affichage de tous les projets si aucune valeur n'a été renseignée
(async function sbScript() {

    //Récupération des catégories sur le serveur    
    const CATEGORIES_RESPONSE = await fetch("http://localhost:5678/api/categories");
    const CATEGORIES_JSON = await CATEGORIES_RESPONSE.json();

    //récupération des travaux sur le serveur    
    const WORKS_RESPONSE = await fetch("http://localhost:5678/api/works");
    const WORKS_JSON = await WORKS_RESPONSE.json();
 
    //déclaration d'un pointeur sur la barre de filtre
    const filterbarClass = document.querySelector(".filterbar");   

    //reinitialisation de la barre de filtre
    //filterbarClass.innerHTML = "";

    //ajout des catégories dans la barre de filtre
    appendCategories(filterbarClass);

    //ajout des projets dans la galerie par catégories
    appendWorks(WORKS_JSON, 0); //0 = tous

    //ajout des catégories dans la barre de filtre
    function appendCategories(filterbarClass) {
        
        //ajout des catégories dans la barre de filtre
        appendCategory(filterbarClass, {id: 0, name: 'Tous'});
        let i = 0;
        while (i < CATEGORIES_JSON.length) {
            appendCategory(filterbarClass, CATEGORIES_JSON[i]);
            i++;
        };

    }

    //ajout des projets dans la galerie par catégories
    function appendWorks(worksJson, categoryId = 0) {

        //déclaration d'un pointeur sur la galerie
        const galleryClass = document.querySelector(".gallery");

        //reinitialisation de la galerie
        galleryClass.innerHTML = "";

        //ajout des projets dans la galerie
        i = 0;
        while (i < worksJson.length) {
            if (worksJson[i].category.id == categoryId || categoryId == 0) {
                appendWork(galleryClass, worksJson[i]);
            }
            i++;
        };
    }

    //function permettant l'ajout d'une catégorie
    function appendCategory(filterbar, category) {
        //déclaration des éléments à ajouter
        let pElement = document.createElement("p");
        let divElement = document.createElement("div");

        //définition du contenu des éléments
        pElement.innerHTML = category.name;
        divElement.className = "button";
        divElement.addEventListener("click",  () => {
            appendWorks(WORKS_JSON, category.id);
        });

        //ajout de l'élément p dans l'élément div
        divElement.appendChild(pElement);
        
        //ajout des éléments dans la barre des catégories
        filterbar.appendChild(divElement);
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

    this.menu = {
        init: function () {
            //récupération des éléments de page
            const footerElement = document.querySelector("footer");
            const loginButtonElement = document.querySelector(".login");
            const worksElement = document.querySelector(".works");
            const loginSectionElement = document.querySelector("#login");
            const introductionElement = document.querySelector("#introduction");
            const portfolioElement = document.querySelector("#portfolio");
            const contactElement = document.querySelector("#contact");

            //ajout d'un évènement "click" sur le bouton de login qui permet d'afficher la section login
            loginButtonElement.addEventListener("click",  () => {
                //mainElement.style.display = "none";
                portfolioElement.style.display = "none";
                footerElement.style.display = "none";
                introductionElement.style.display = "none";
                contactElement.style.display = "none";
                loginSectionElement.style.display = "block";
            });

            //ajout d'un évènement "click" sur le bouton de projets qui permet de masquer la section login
            worksElement.addEventListener("click",  () => {
                //mainElement.style.display = "block";
                portfolioElement.style.display = "block";
                footerElement.style.display = "block";
                introductionElement.style.display = "block";
                contactElement.style.display = "block";
                loginSectionElement.style.display = "none";
            });
        },
        load: async function () {

        }
    };
})();

sbScript.menu.init();