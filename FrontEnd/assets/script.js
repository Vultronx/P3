/*** affichage dynamique du contenu du site ***/

(async function script() {
    console.log("Execution du script principal")
    //racine du script
    const root = this;
    this.Works_JSON = null;
    this.Categories_JSON = null;

    //Récupération des catégories sur le serveur    
    const CATEGORIES_RESPONSE = await fetch("http://localhost:5678/api/categories");
    const CATEGORIES_JSON = await CATEGORIES_RESPONSE.json();

    //récupération des travaux sur le serveur    
    const WORKS_RESPONSE = await fetch("http://localhost:5678/api/works");
    let WORKS_JSON = await WORKS_RESPONSE.json();
 
    //déclaration d'un pointeur sur la barre de filtre
    const filterbar = document.querySelector(".filterbar");
    this.worksManageModal = document.getElementById("works-manage");
    this.worksAddModal = document.getElementById("works-add");

    this.workPicture = document.querySelector("#works-add #work-picture");

    //ajout des catégories dans la barre de filtre
    showCategories(filterbar);

    //affiche les projets dans la galerie par catégories
    showWorks(WORKS_JSON, 0); //0 = tous

    //ajout des catégories dans la barre de filtre
    function showCategories(filterbar) {
        
        //ajout des catégories dans la barre de filtre
        showCategory(filterbar, {id: 0, name: 'Tous'});
        let i = 0;
        while (i < CATEGORIES_JSON.length) {
            showCategory(filterbar, CATEGORIES_JSON[i]);
            i++;
        };

    };

    //ajout des projets dans la galerie par catégories
    function showWorks(worksJson, categoryId = 0) {

        //déclaration d'un pointeur sur la galerie
        const galleryClass = document.querySelector(".gallery");

        //reinitialisation de la galerie
        galleryClass.innerHTML = "";

        //affichage des projets dans la galerie
        i = 0;
        while (i < worksJson.length) {
            if (worksJson[i].category.id == categoryId || categoryId == 0) {
                showWork(galleryClass, worksJson[i]);
            }
            i++;
        };
    };

    //fonction permettant l'ajout d'une catégorie
    function showCategory(filterbar, category) {
        //déclaration des éléments à ajouter
        let pElement = document.createElement("p");
        let divElement = document.createElement("div");

        //définition du contenu des éléments
        pElement.innerHTML = category.name;
        divElement.className = "button";
        divElement.addEventListener("click",  () => {
            showWorks(WORKS_JSON, category.id);
        });

        //ajout des éléments dans la barre de catégorie
        divElement.appendChild(pElement);
        filterbar.appendChild(divElement);

        let categoriesSelectElement = document.getElementById("work-category");
        let optionElement = document.createElement("option");

        if (category.name != "Tous") {
            optionElement.value = category.id;
            optionElement.innerHTML = category.name;
            categoriesSelectElement.appendChild(optionElement);
        }
    };

    //fonction permettant l'ajout d'un projet dans la galerie
    function showWork(gallery, work) {
        
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

        //création des éléments qui serviront à la gestion des projets
        let figureOverviewElement = document.createElement("figure");
        let imageOverviewElement = document.createElement("img");
        let deleteButtonElement = document.createElement("img");
        figureOverviewElement.style.display = "inline-block";
        figureOverviewElement.style.position = "relative";
        imageOverviewElement.src = work.imageUrl;
        imageOverviewElement.alt = work.title;
        deleteButtonElement.className = "deleteButton";
        deleteButtonElement.src = "./assets/icons/delete.png";
        deleteButtonElement.alt = "x";
        deleteButtonElement.style.position = "absolute";
        deleteButtonElement.style.top = "5px";
        deleteButtonElement.style.right = "5px";
        deleteButtonElement.style.cursor = "pointer";
        deleteButtonElement.style.zIndex = "1";

        /*** checked ***/
        //Ajout d'un bouton de suppression sur l'image du projet
        deleteButtonElement.addEventListener("click", async () => {
            await fetch("http://localhost:5678/api/works/"+work.id, { //suppression du projet sur le serveur
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer "+window.localStorage.getItem("token"),
                }
            })
            .then((response) => {
                if (response.ok) { //si la suppression est confirmé alors on valide la suppression sur le DOM
                    figureElement.remove();
                    figureOverviewElement.remove();
                } else { //on retourne false si ce n'est pas confirmé
                    return false;
                }
            })
        });
        /*** checked ***/
        
        const worksOverviewElement = document.querySelector(".works-manage .overview");
        figureOverviewElement.appendChild(imageOverviewElement);
        figureOverviewElement.appendChild(deleteButtonElement);
        worksOverviewElement.appendChild(figureOverviewElement);
    };

    (function worksManage() {
            const addButtonElement = document.querySelector(".works-manage .add-button");
            const previousButtonElement = document.querySelector(".works-add .previous-button");
            const closeButtonElement = document.querySelector(".works-add .close-button");

            const pictureElement = document.querySelector(".picture");
            const addImageButtonElement = document.querySelector(".add-image-button");
            const pElement = document.querySelector(".picture-overview p");

            addButtonElement.addEventListener("click", () => {
                const pictureOverviewElement = document.querySelector(".picture-overview");

                root.worksManageModal.style.display = "none";
                root.worksAddModal.style.display = "block";

                pictureElement.style.display = "flex";
                addImageButtonElement.style.display = "flex";
                pElement.style.display = "flex";
                pictureOverviewElement.style.padding = "16px 0px 20px 0px";
                pictureOverviewElement.style.height = "142px";

                resetAddWorkForm();
            });
            previousButtonElement.addEventListener("click", () => {
                root.worksManageModal.style.display = "block";
                root.worksAddModal.style.display = "none";
                root.workPicture.style.display = "none";
            });
            closeButtonElement.addEventListener("click", () => {                
                root.workPicture.style.display = "none";
                //fermeture de la modale par appel aux nodes parents
                closeButtonElement.parentNode.parentNode.style.display = "none";
            });
            window.onclick = function(event) {
                if (event.target == this.worksManageModal) {
                    root.worksManageModal.style.display = "none";
                } else if (event.target == this.worksAddModal) {
                    root.worksAddModal.style.display = "none";
                    root.workPicture.style.display = "none";
                }
            }
            //Gestion de l'input qui permet de récupérer l'image d'un nouveau projet à ajouter
            const pictureInputElement = document.getElementById("picture-input");
            pictureInputElement.addEventListener("change", () => {
                console.log("Name : "+pictureInputElement.files[0].name);
                console.log("Size : "+pictureInputElement.files[0].size);
                console.log(window.URL.createObjectURL(pictureInputElement.files[0]));
                const pictureOverviewElement = document.querySelector(".picture-overview");

                root.workPicture.src = window.URL.createObjectURL(pictureInputElement.files[0]);
                
                pictureElement.style.display = "none";
                addImageButtonElement.style.display = "none";
                pElement.style.display = "none";

                root.workPicture.style.display = "block";
                root.workPicture.style.width = "auto";
                root.workPicture.style.height = "100%";

                pictureOverviewElement.style.padding = "0px 0px 0px 0px";
                pictureOverviewElement.style.height = "178px";
                pictureOverviewElement.appendChild(root.workPicture);
                
            });
            function resetAddWorkForm() {
                const pictureInputElement = document.getElementById("picture-input");
                const workTitle = document.getElementById("work-title");
                const workCategory = document.getElementById("work-category");
                pictureInputElement.value = "";
                workTitle.value = "";
                workCategory.getElementsByTagName('option')[0].selected = 'selected'
            }
            //mise à jour de la liste des projets des projets
            worksUpdate();
        })();

    async function worksUpdate() {
        const json = await fetch("http://localhost:5678/api/works")
        .then((response) => {
            if (!response.ok)
                console.log("Erreur lors de la récupération des données")
                return false;
        })
        root.Works_JSON = json;
    }

    this.categories = {
        init: async function () {
            await this.update();
        },
        update: async function () {
            //récupération des catégories sur le serveur    
            let response = await fetch("http://localhost:5678/api/categories");
            if (!response.ok)
                return false;
            root.Categories_JSON = await response.json();
            return true;
        }
    };

    await root.categories.init();

    this.menu = {
        init: function () {

            //récupération des éléments de page
            const loginButtonElement = document.querySelector(".login");
            const worksElement = document.querySelector(".works");

            //ajout d'un évènement "click" sur le bouton de login qui permet d'afficher la section login
            loginButtonElement.addEventListener("click",  () => {
                console.log("Affichage de la page de connexion");
                this.loginShow();
            });

            //ajout d'un évènement "click" sur le bouton de projets qui permet de masquer la section login
            worksElement.addEventListener("click",  () => {
                console.log("Fermeture de la page de connexion");
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
            const filterbarElement = document.querySelector(".filterbar");
            const editorBarElement = document.querySelector(".editor-bar");
            const worksModifyButtonElement = document.querySelector(".works-modify-button");
            const headerBarElement = document.querySelector(".header-bar");
            filterbarElement.style.display = "none";
            editorBarElement.style.display = "flex";
            worksModifyButtonElement.style.display = "flex";
            headerBarElement.style.margin = "80px 0px 50px 0px";
            
        },
        editorHide: function() {
            const filterbarElement = document.querySelector(".filterbar");
            const editorBarElement = document.querySelector(".editor-bar");
            const worksModifyButtonElement = document.querySelector(".works-modify-button");
            const headerBarElement = document.querySelector(".header-bar");
            filterbarElement.style.display = "flex";
            editorBarElement.style.display = "none";
            worksModifyButtonElement.style.display = "none";
            headerBarElement.style.margin = "30px 0px 50px 0px";
        }
    };
    this.menu.init();

    (function login() {
            const loginForm = document.querySelector("#login-form");
            loginForm.addEventListener("submit", async (event) => {
                
                //on empeche le rechargement de la page
                event.preventDefault();
                
                //récupération des valeurs des champs id et password
                const id = document.getElementById("id").value;
                const password = document.getElementById("password").value;

                console.log("Tentative de connexion ...")
                console.log("ID : "+id+" | Password : "+password);

                //nn essaye de se connecter
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
                    if (data.error) {
                        //console.log(data.error);/*displays error message*/
                        console.log("Utilisateur non autorisé");
                        window.alert("Veuillez vérifier votre identifiant et/ou mot de passe");
                    } else {
                        if (data.message != "user not found") {

                            console.log("Connexion autorisée");
                            window.alert("Vous êtes connecté");
                            console.log("Stockage du token d'identification");
                            //stokage du token dans le localstorage
                            window.localStorage.setItem("token", data.token);

                            //modification du menu
                            loginButtonElement.style.display = "none";
                            logoutButtonElement.style.display = "list-item";

                            //on prépapre le bouton logout pour que l'utilisateur puisse de déconnecter
                            logoutButtonElement.addEventListener("click", function () {
                                window.localStorage.removeItem("token", "[]");
                                loginButtonElement.style.display = "list-item";
                                logoutButtonElement.style.display = "none";
                                root.menu.editorHide();
                                console.log("Déconnexion");
                                window.alert("Vous êtes déconnecté");
                            });

                            //réinitialisation du formulaire de connexion
                            document.getElementById("id").value = "";
                            document.getElementById("password").value = "";

                            //On affichage la page des projets et le mode éditeur
                            root.menu.worksShow();
                            root.menu.editorShow();
                            console.log("Affichage du mode édition");

                        } else {
                            window.alert("Utilisateur inconnu");
                            console.log("Utilisateur inconnu");
                        }
                    }
                })
                /*.catch((err) => {
                    //console.log(err);
                });*/
            });
    })();

    this.editor = {
        init: function () {
            root.worksManageModal.style.display = "none";
            const worksModifyButton = document.querySelector(".works-modify-button");
            worksModifyButton.addEventListener("click", function () {
                root.worksManageModal.style.display = "block";
            });
            const worksModifyCloseButton = document.querySelector(".works-manage .close-button");
            worksModifyCloseButton.addEventListener("click", function () {
                root.worksManageModal.style.display = "none";
            });

            const worksSendButton = document.querySelector(".works-add .send-button");

            const pictureInputElement = document.getElementById("picture-input");
            const worksSendForm = document.querySelector("#works-send-form");
            
            let workPicture = document.querySelector("#works-add #work-picture");
            let workTitle = document.querySelector("#works-add #work-title");
            let workCategory = document.querySelector("#works-add #work-category");

            //Nouvelle version
            worksSendForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                const formData = new FormData(event.target);

                await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer "+window.localStorage.getItem("token"),
                    },
                    body: formData,
                })
                .then((response) => {
                    if (response.redirected) {
                        console.log("redirection : "+response.url);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                    if (data.error) {
                        alert(data.error);
                    }
                })
                const galleryClass = document.querySelector(".gallery");
                let response = await fetch("http://localhost:5678/api/works");
                let json = await response.json();
                showWork(galleryClass, json[json.length-1]);
                //workPicture.removeAttribute('src');
                root.worksAddModal.style.display = "none";
                root.workPicture.style.display = "none";
                //worksSendForm.reset();
            });

        },
        open: function () {

        },
        close: function () {

        }
    };
    this.editor.init();

})();