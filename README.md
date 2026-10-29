# Zen-Move · site vitrine

One-page statique (HTML/CSS/JS, sans build). Preview locale : `python3 -m http.server 4173 --directory zen-move`.

## Direction artistique
- Palette tirée du logo : rouge `#D82E1F`, noir, anthracite des couvertures de déménagement, gris béton.
- Typo : Saira (largeur variable, l'italique étendu reprend le wordmark) + Instrument Sans.
- Fil rouge : l'étiquette de carton numéroté (« Carton 01/07 »), vue sur les photos du client.
- Éléments propres au client : bon de déménagement dans le hero, registre des habitués (12 avis de clients revenus 2 à 6 fois), estimateur de volume relié au formulaire.

## Sources
- Fiche Google : 5,0 · 50 avis, 07 68 21 43 04, lun–ven 8h–20h, sam 8h–17h.
- Photos et logo : photos du propriétaire sur la fiche Google (originaux dans `../zen-move-photos-source/`).
- Citations : avis Google publics, noms abrégés.

## À compléter avant mise en ligne
- [ ] Email de réception du formulaire → `data-endpoint` sur `#quoteForm` (`https://formsubmit.co/ajax/{email}`). Vide = repli SMS.
- [ ] Domaine perso : remplacer `https://znk-v.github.io/zen-move-demenagement/` (canonical, og, sitemap, robots) et ajouter un fichier CNAME.
- [ ] Mentions légales : forme juridique, siège, SIRET, registre des transporteurs, assurance.
- [ ] Faire valider par Ali : promesse « devis sous 24h », liste des communes, fonctionnement du garde-meubles.
- [ ] Photos en meilleure résolution si Ali en a (hero surtout).
