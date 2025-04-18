import { View, FlatList, StyleSheet, Button, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState, useEffect, Fragment } from "react";
import ProductsCard from "./ProductsCard";
import { ProductsData } from "../../data/ProductsData";
import axiosInstance from "../../httpRequest/Request";
import { useQuery } from "react-query";
import AntDesign from '@expo/vector-icons/AntDesign';

// on récupère tous les produits de l'api
const getAllProduct = async () =>{
    const {data} = await axiosInstance.get('/product/get-all')
    return data
}

const Products = () => {
    const [visibleProducts, setVisibleProducts] = useState(6); // Nombre initial de produits visibles

    const handleShowMore = () => {
        setVisibleProducts((prev) => prev + 6); // Affiche 6 produits de plus à chaque fois
    };

    const handleShowLess = () => {
        setVisibleProducts((prev) => (prev > 6 ? prev - 6 : prev)); // Réduit de 6 produits, mais ne descend pas en dessous de 6
    };

    // on utilise le hook useQuery pour la requête des produits
    const {data, isLoading, isError, refetch} = useQuery('getAllProduct', getAllProduct)
    
    if(isLoading){
        return (
            <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:150}}>
                <ActivityIndicator size={"large"} color={'black'} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                isError ? 
                (
                    <TouchableOpacity
                        style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:150}}
                        onPress={refetch}
                    >
                        <AntDesign name="reload1" size={24} color="black" />
                    </TouchableOpacity>
                )
                :
                (
                    <Fragment>
                        <FlatList
                            data={data.products?.slice(0, visibleProducts)} // Limite le nombre de produits affichés
                            numColumns={2}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <View style={styles.productContainer}>
                                    <ProductsCard p={item} />
                                </View>
                            )}
                            contentContainerStyle={styles.productList}
                        />

                        <View style={styles.buttonContainer}>
                            {visibleProducts < ProductsData.length && ( // Affiche le bouton "Afficher plus" s'il reste des produits à afficher
                                <TouchableOpacity  onPress={handleShowMore} >
                                    <Text style={{fontWeight:'bold'}}>Afficher plus </Text>
                                </TouchableOpacity>
                            )}
                            {visibleProducts > 6 && ( // Affiche le bouton "Afficher moins" uniquement s'il y a plus de produits affichés que le nombre initial
                                <TouchableOpacity  onPress={handleShowLess} >
                                    <Text style={{fontWeight:'bold'}}>Afficher moins </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </Fragment>
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 80, // Espace sous la liste pour éviter que les produits chevauchent le footer
    },
    productList: {
        paddingHorizontal: 10,
        justifyContent: "space-between",
        marginRight:10
    },
    productContainer: {
        flex: 1,
        margin: 5, // Ajout d'un léger espace entre les produits
        maxWidth: "48%", // Pour s'assurer que deux produits tiennent dans une ligne
    },
    buttonContainer: {
        justifyContent: "center",
        marginTop: 20,
        alignItems: "center", // Centrer les boutons
        backgroundColor: "lightgray",
        borderRadius: 5,
        height:45,
        marginHorizontal:25
    },
});

export default Products;
