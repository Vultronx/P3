//Récupération des projets et affichage dans le DOM
//le paramètre attendu est un entier correspondant à l'ID de la catégorie souhaitée
//par defaut, categorieID = 0. Affichage de tous les projets si aucune valeur n'a été renseignée
(async function sbScript() {

    const root = this;
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

    };

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
    };

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
            const loginButtonElement = document.querySelector(".login");
            const worksElement = document.querySelector(".works");

            //ajout d'un évènement "click" sur le bouton de login qui permet d'afficher la section login
            loginButtonElement.addEventListener("click",  () => {
                this.loginShow();
            });

            //ajout d'un évènement "click" sur le bouton de projets qui permet de masquer la section login
            worksElement.addEventListener("click",  () => {
                this.worksShow();
            });
        },
        worksShow: function () {
            //récupération des éléments de page
            const footerElement = document.querySelector("footer");
            const loginSectionElement = document.querySelector("#login");
            const introductionElement = document.querySelector("#introduction");
            const portfolioElement = document.querySelector("#portfolio");
            const contactElement = document.querySelector("#contact");

            portfolioElement.style.display = "block";
            footerElement.style.display = "block";
            introductionElement.style.display = "flex";
            contactElement.style.display = "block";
            loginSectionElement.style.display = "none";
        },
        loginShow: function () {
            //récupération des éléments de page
            const footerElement = document.querySelector("footer");
            const loginSectionElement = document.querySelector("#login");
            const introductionElement = document.querySelector("#introduction");
            const portfolioElement = document.querySelector("#portfolio");
            const contactElement = document.querySelector("#contact");

            portfolioElement.style.display = "none";
            footerElement.style.display = "none";
            introductionElement.style.display = "none";
            contactElement.style.display = "none";
            loginSectionElement.style.display = "block";
        },
        editorShow: function() {
            const editorBarElement = document.querySelector(".editor-bar");
            editorBarElement.style.display = "flex";
        },
        editorHide: function() {
            const editorBarElement = document.querySelector(".editor-bar");
            editorBarElement.style.display = "none";
        }
    };
    this.menu.init();

    this.loginSubmit = {
        init: function () {
            const loginForm = document.querySelector("#login-form");
            loginForm.addEventListener("submit", async (event) => {
                
                //on empeche le rechargement de la page
                event.preventDefault();
                
                //récupération des valeurs des champs id et password
                const id = document.getElementById("id").value;
                const password = document.getElementById("password").value;

                console.log("ID : "+id+" | Password : "+password);

                console.log("On compare id et password avec la base donnée");
                await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: id,
                        password: password,
                    }),
                })
                .then((response) => response.json())
                .then((data) => {
                    const loginButtonElement = document.querySelector(".login");
                    const logoutButtonElement = document.querySelector(".logout");
                    //on affiche la réponse
                    console.log(data);
                    if (data.error) {
                        //console.log(data.error);/*displays error message*/
                        console.log("Utilisateur non autorisé");
                    } else {
                        if (data.message != "user not found") {
                            //enregistrement du token dans le localstorage
                            window.localStorage.setItem("token", data.token);
                            //affichage des éléments du mode édition
                            console.log("affichage du mode edition");
                            //récupération du token dans le localstorage
                            const token = window.localStorage.getItem("token");
                            //modification du menu
                            loginButtonElement.style.display = "none";
                            logoutButtonElement.style.display = "list-item";

                            document.getElementById("id").value = "";
                            document.getElementById("password").value = "";

                            root.menu.worksShow();
                            root.menu.editorShow();

                            if (data.token === token) {
                                console.log("Mode édition confirmé !")
                            }
                            //si logout
                            logoutButtonElement.addEventListener("click", function () {
                                console.log("Déconnexion en cours ...");
                                console.log(window.localStorage.getItem("token"));
                                window.localStorage.removeItem("token", "[]");
                                console.log(window.localStorage.getItem("token"));
                                loginButtonElement.style.display = "list-item";
                                logoutButtonElement.style.display = "none";
                                root.menu.editorHide();
                                console.log("Déconnecté !");
                            });
                        } else {
                            console.log("Utilisateur inconnu");
                        }
                    }
                })
                /*.catch((err) => {
                    //console.log(err);
                });*/
            });
        },
        load: async function () {

        }
    };
    this.loginSubmit.init();

})();
//const colis = await fetch("http://api.top-livraisons.fr/colis").then(colis => colis.json());
//const livreur = await fetch("http://api.top-livreurs.fr/livreurs/" + colis.livreurId).then(livreur => livreur.json());
/*fetch("/colis/livraison", {
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "body": // ...
});*/

/*const livreur = /* fonction fetch ;

// Récupération du localStorage ou initialisation de la liste de livreurs
let livreurs = window.localStorage.getItem("livreurs");
if (livreurs === null) { livreurs = []; }
else { livreurs = JSON.parse(livreurs); }

// Suppression du livreur s’il existe déjà
const indice = livreurs.find(liv => liv.id === livreur.id);
if (indice !== -1) { livreurs.splice(indice, 1); }

// Ajout du livreur et sauvegarde dans le localStorage
livreurs.push(livreur);
window.localStorage.setItem("livreurs", JSON.stringify(livreurs));*/

//pour vider entierement la liste des livreurs : setitem avec des crochets
//window.localStorage.setItem("livreurs", "[]");
