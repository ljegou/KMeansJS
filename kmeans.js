// Détermination des bornes de classes selon la méthode des K-Moyennes
// Idée : L. Jégou ljegou@gmail.com
// Contributions : Estelle Ancelet, Pauline Crombette

//Extension des arrays classiques
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

// Calcul de la moyenne d'un tableau
function calcMoyenne(tableau) {
	var i, sum = 0, l = tableau.length;
	for (i=0; i<l; i++) {
		sum += +tableau[i]; 
	}
	return sum / l;
}

//Fonction qui renvoie l'indice de la classe qui contient la valeur recherchée
function determineClasse(indValeur, nbClasses, tabCompteurClasse) {
	var rgMin = 0;
	var rgMax = tabCompteurClasse[0] - 1;
	var indClasse = 0;
	
	for(i=0; i<nbClasses; i++){
		if ((indValeur>=rgMin) && (indValeur<=rgMax)) {
			indClasse = i;
			break;
		}
		if (i<(nbClasses-1)) {
			rgMin += tabCompteurClasse[i];
			rgMax = rgMin + tabCompteurClasse[i+1] - 1;
		}
	}
	return indClasse;
}

//Renvoie un tableau de bornes à partr d'une discrétisation
function extraitBornes(tableau, compteurClasse) {
	var nbIndividus = tableau.length;
	var nbClasses = compteurClasse.length;
	
	tableau.sort;
	var listeBornes = [];
	var indBorne = 0;
	
	for (indClasse=0; indClasse<nbClasses; indClasse++){
		listeBornes[indClasse] = tableau[indBorne];
		indBorne += compteurClasse[indClasse];
	}
	listeBornes[nbClasses] = tableau[nbIndividus - 1];
	
	return listeBornes;
}

//Fonction callback du tri comme des nombres
function sortNumber(a,b) {
    return a - b;
}

// Calcul de la discrétisation
// Paramètres : nombre de classes désiré et tableau de valeurs
function algoKMeans(nbClasses, tableau) {
	
	var variation = 1; //Variation entre deux itérations du calcul de la discrétisation
	var nbIndividus = tableau.length; //Nombre d'individus de la variable
	var tailleClasse = Math.floor(nbIndividus/nbClasses); //Effectif des classes de départ, identique pour chaque (car quantiles);
	
	//Tri du tableau de valeurs
	tableau.sort(sortNumber);
	
	//Calcul des bornes initiales
	var compteurClasseIterationPrec = [];
	for (i=0; i<nbClasses-1; i++) {
		compteurClasseIterationPrec[i] = tailleClasse;
	}
	
	// Selon l'arrondi, la dernière classe peut prendre un nombre variable d'individus
	compteurClasseIterationPrec[i] = nbIndividus - (nbClasses-1) * tailleClasse;
	
	var iterations = 0;
	var moyenneParClasse = [];
	var sommeParClasse = [];
	
	while (variation == 1) {
		variation = 0;
		iterations++;
		console.log("Itération "+iterations);
		var compteurClasseIterationCourante = compteurClasseIterationPrec;
		var borneInfClasseCourante = 0;
		
		//Calcul des moyennes pour chaque classe
		for(var indClasse = 0; indClasse<nbClasses; indClasse++){
			//Calcul de la moyenne
			var nbIndivClasse = compteurClasseIterationPrec[indClasse];
			var classe = tableau.slice(borneInfClasseCourante, borneInfClasseCourante+nbIndivClasse);
			var moyenne = calcMoyenne(classe);
			moyenneParClasse[indClasse] = moyenne;
			borneInfClasseCourante += nbIndivClasse;
		}
		
		//Calcul des distances des individus à chacune des moyennes des classes
		var distanceAuxMoyennes = [];
		for (indValeur = 0; indValeur < nbIndividus; indValeur++) {
			var valeurCourante = tableau[indValeur];
			
			for (indClasse = 0; indClasse < nbClasses; indClasse++) {
				distanceAuxMoyennes[indClasse] = Math.pow((moyenneParClasse[indClasse] - valeurCourante), 2);
			}
			
			//Détermination de l moyenne la plus proche
			var minDistanceAuxMoyennes = Math.min.apply(null, distanceAuxMoyennes);
			var rangMindistanceAuxMoyennes = distanceAuxMoyennes.indexOf(minDistanceAuxMoyennes);
			
			//Rang de la classe précédemment associée à la valeur courante
			var rangClassePrecValeurCourante = determineClasse(indValeur,nbClasses, compteurClasseIterationPrec);
			if (rangMindistanceAuxMoyennes!=rangClassePrecValeurCourante) {
				//Le nombre d'individus de la classe précedemment associée à la valeur courante diminue
				compteurClasseIterationCourante[rangClassePrecValeurCourante]--;
				//Le nombre d'individus de la classe qui sera associée à la valeur courante augmente
				compteurClasseIterationCourante[rangMindistanceAuxMoyennes]++;
				variation = 1;
			}
		} //For indValeur
		//Mise à jour du compteur pour l'itération suivante
		compteurClasseIterationPrec = compteurClasseIterationCourante;

	} //While
	var listeBornes = extraitBornes(tableau, compteurClasseIterationCourante);
	
	return listeBornes;
	
}// algoKMeans