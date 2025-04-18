import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addToCart, clearCart } from "../../redux/cart/cartSlice";

const ProductsCard = ({ p }) => {
    const navigation = useNavigation();
    const usedispatch = useDispatch()

    // Détails du produit
    const handleMoreButton = (item) => {
        navigation.navigate("productDetails", { item });
    };

    // Ajout au panier on doit améliorer cette méthode plus tard
    const handleAddToCart = () => {
        usedispatch(addToCart(p))
        alert("added to cart succefuly");
    };
    return (
        <View style={styles.card} >
            <TouchableOpacity onPress={() => handleMoreButton(p)}>
                <Image style={styles.cardImage} source={{ uri: p?.images[0].url }} />
                <Text style={styles.cardTitle}>{p?.name}</Text>
                <Text style={styles.cardDesc}>
                    {p?.description.substring(0, 30)} ...<Text style={{color:'orange'}}>more</Text>
                </Text>
                <View style={styles.BtnContainer}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => handleMoreButton(p)}
                    >
                        <Text style={styles.btnText}>Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnCart} onPress={handleAddToCart}>
                        <Text style={styles.btnText}>ADD TO CART</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ProductsCard;

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 8, // Pour arrondir les bords
        marginVertical: 10,
        marginHorizontal: 5,
        width: "100%", // Utilise tout l'espace disponible dans une colonne 
        padding: 10,
        backgroundColor: "#ffffff",
    },
    cardImage: {
        height: 120,
        width: "100%",
        marginBottom: 10,
        borderRadius: 5,
        resizeMode: "cover", // Assure que l'image est bien ajustée
    },
    cardTitle: {
        fontSize: 12, // Ajustement de la taille
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center", // Centrer le texte
    },
    cardDesc: {
        fontSize: 11,
        textAlign: "left",
        marginBottom: 10,
    },
    BtnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    btn: {
        backgroundColor: "#000000",
        height: 30, // Ajuste la taille des boutons
        width: "48%",
        borderRadius: 5,
        justifyContent: "center",
    },
    btnCart: {
        backgroundColor: "orange",
        height: 30,
        width: "48%",
        borderRadius: 5,
        justifyContent: "center",
    },
    btnText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: 12, // Meilleure lisibilité
        fontWeight: "bold",
    },
});

