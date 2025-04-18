import { useQuery } from 'react-query';
import axiosInstance from './Request';
 // Assurez-vous d'importer votre instance Axios

/* 
    dans cette fonction, chaque élément du tableau doit corespondre à sa requête
    on a deux éléments dans le tab et on a aussi 2 requêtes , on peux encore ajouter d'autres
    NB: il fait respecter les url des différentes méthodes http
*/ 
const fetchCategory = async () => {
    const [allCategory, limitedCateory, categoryById] = await Promise.all([
    axiosInstance.get('/category/all'),
    axiosInstance.get('/category/limit')
    // axiosInstance.get('/category/all')
    ]);

    return {
        allCategory: allCategory.data,
        limitedCateory: limitedCateory.data,
        // categoryById: categoryById.data
    };
};

// on a créé un hook personalisé qui permet d'utiliser useQuery
// et nous permet également de faire des requêtes depuis la fonction "fetch"
export const useFetchCategory = () => {
    return useQuery('fetchCategory', fetchCategory);
};

/*
    NB: on peut également créer des hook personnalisés pour chaque groupe de requête
    et ensuite on pourra utiliser chaque hook personnalisé où on souhaite.
*/


// on va récupérer les produits
const fetchProduct = async () =>{
    const [limitedProduct] = await Promise.all([
        axiosInstance.get(`/api/v1/product/get-all`)
    ])
    return limitedProduct
}
export const useFetchProduct = () =>{
    return useQuery('fetchProduct', fetchProduct)
}

// on va récupérer les commandes d'achat "order"
const fetchOrder = async () =>{
    const [limitedOrder] = await Promise.all([
        axiosInstance.get("/order/all")
    ])
    return limitedOrder
}
export const useFetchOrder = () =>{
    return useQuery("fetchOrder", fetchOrder)
}

