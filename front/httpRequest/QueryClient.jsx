import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Le cache des données est conservé pendant 5 minutes (300000 ms)
            staleTime: 5 * 60 * 1000, 

            // Le cache est réutilisé pendant 1 minute après avoir quitté la vue (60000 ms)
            cacheTime: 1 * 60 * 1000,

            // Réessaye les requêtes échouées 3 fois avant de déclarer une erreur
            retry: 3,

            // Attend 1 seconde avant de réessayer une requête échouée
            // retryDelay: 1000,

            // Active le refetching automatique en arrière-plan lorsque la fenêtre est à nouveau focus
            refetchOnWindowFocus: true,

            // Active le refetching lorsque la fenêtre est reconnectée (utile pour les mobiles)
            refetchOnReconnect: true,

            // Refait la requête chaque fois que l'utilisateur entre à nouveau dans la vue
            refetchOnMount: false,

            // Refait la requête lorsque les données sont considérées comme "obsolètes"
            refetchOnStale: true,

            // Désactive le polling automatique par défaut (peut être activé pour certaines requêtes spécifiques)
            refetchInterval: false,

            // Désactive le polling automatique en arrière-plan lorsque la fenêtre n'est pas focus
            refetchIntervalInBackground: false,

            // Désactive l'erreur en cas d'absence de connexion Internet
            suspense: false,
        },
        mutations: {
            // Réessaye les mutations échouées 3 fois
            retry: 3,

            // Attend 1 seconde avant de réessayer une mutation échouée
            retryDelay: 1000,
        },
    },
});

export default queryClient;
