---
title: Snake
publishDate: 2023-01-03 23:40:00
img: ./asset/project/stock-4.jpg
img_alt: Iridescent ripples of a bright blue and pink liquid
description: J'ai recodé le célèbre jeu Space Invaders en Python à partir de zéro !
tags:
  - Jeux
  - IA
  - Python
---

<!-- ![alt text](/assets/spaceinvader.gif) -->

# Projet Snake avec Pyxel et IA

### Description

Ce projet est une implémentation moderne et innovante du jeu classique Snake, développée en Python avec l'utilisation de la bibliothèque graphique Pyxel. Au-delà de recréer l'expérience nostalgique du serpent se déplaçant à l'écran pour manger des fruits et grandissant à chaque fois, ce projet a pour ambition de franchir une étape supplémentaire : l'intégration d'une intelligence artificielle. L'objectif est de former un modèle d'IA capable de jouer au jeu de manière autonome, apprenant à naviguer dans l'environnement du jeu de façon intelligente et efficace pour maximiser le score sans heurter les bords de l'écran ou le corps du serpent lui-même.


### Fonctionnalités

Le jeu inclut plusieurs fonctionnalités pour enrichir l'expérience utilisateur :

- **Déplacement du Serpent** : Le serpent peut se déplacer dans quatre directions (haut, bas, gauche, droite) à l'aide des touches fléchées ou des touches Z/Q/S/D du clavier.
- **Génération de Fruits** : Les fruits apparaissent à des positions aléatoires sur l'écran et servent de nourriture pour le serpent.
- **Score** : Le score augmente chaque fois que le serpent mange un fruit. Le score actuel est affiché en permanence à l'écran.
- **Game Over** : Le jeu se termine si le serpent se heurte à lui-même ou aux bords de l'écran. Un message "GAMEOVER" apparaît, et le joueur peut redémarrer le jeu en appuyant sur la touche R.
- **Niveaux de Difficulté** : La vitesse du serpent augmente à mesure que le score s'élève, ajoutant ainsi un défi supplémentaire au jeu.

### Structure du Code

Le projet est structuré autour de plusieurs classes principales :

- `App` : Gère l'initialisation du jeu, les cycles de dessin et de mise à jour, ainsi que les interactions utilisateur.
- `Snake` : Contrôle le comportement du serpent, y compris son mouvement et sa croissance lorsqu'il mange un fruit.
- `Fruit` : Gère la position et l'affichage des fruits sur l'écran.

### Aperçu

Voici un aperçu du jeu et le repo du code [GitHub](https://github.com/gus5900000/Snake-IA)


![Snake Gif](./asset/project/snake.gif)
