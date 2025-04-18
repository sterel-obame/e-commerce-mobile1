import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Créer une instance Axios
const axiosInstance = axios.create({
  // attion cette adresse peut varier par rapport l'ordre de connexion des appareil au wi-fi
  // on doit utiliser l'addre IPv4 qu'on obtion avec cette commande "ipconfig" dans le terminal
  // cette addresse est souvent comme ça "http://192.168.11.103:" ensuite on ajoute le port de notre "api"
  baseURL: 'http://192.168.11.102:8080/api/v1', // Remplacez par l'URL de base de votre API
  timeout: 10000, // Temps d'attente maximum en ms pour une requête
  headers: {
    'Content-Type': 'application/json',
    // Ajoutez d'autres en-têtes par défaut si nécessaire
  },

});

// Interceptor pour inclure le token d'authentification dans chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = AsyncStorage.getItem('@auth'); // Récupérez le token depuis le stockage local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les erreurs de réponse
axiosInstance.interceptors.response.use(
  (response) => {
      // Si la réponse est valide, simplement la retourner
      return response;
  },
  (error) => {
    // Si une erreur se produit, la gérer ici

    if (error.response) {
      // Erreurs basées sur le code de statut HTTP
      switch (error.response.status) {
        case 400:
        console.error('Bad Request: ', error.response.data);
        console.log('Requête incorrecte.');
        break;
        case 401:
        console.error('Unauthorized: ', error.response.data);
        console.log('Non autorisé. Veuillez vous connecter.');
        // Rediriger vers la page de connexion
        window.location.href = '/login';
        break;
        case 403:
        console.error('Forbidden: ', error.response.data);
        console.log('Accès refusé.');
        break;
        case 404:
        console.error('Not Found: ', error.response.data);
        console.log('Ressource non trouvée.');
        break;
        case 500:
        console.error('Internal Server Error: ', error.response.data);
        console.log('Erreur interne du serveur. Veuillez réessayer plus tard.');
        break;
        default:
        console.error(`Erreur HTTP ${error.response.status}: `, error.response.data);
        console.log('Une erreur est survenue. Veuillez réessayer.');
      }
    } else if (error.request) {
      // Aucune réponse reçue du serveur (erreur de réseau)
      console.error('Aucune réponse reçue: ', error.request);
      console.log('Impossible de contacter le serveur. Veuillez vérifier votre connexion Internet.');
    } else {
      // Erreurs lors de la configuration de la requête
      console.error('Erreur de requête: ', error.message);
      console.log('Une erreur est survenue lors de l\'envoi de la requête.');
    }

    // Rejeter la promesse pour propager l'erreur
    return Promise.reject(error);
  }
);
// j'ai remplacé les alert par des console.log()


export default axiosInstance;



