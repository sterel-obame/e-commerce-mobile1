import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { decrementQuantity, incrementQuantity, removeFromCart } from "../../redux/cart/cartSlice";
import FontAwesome from "react-native-vector-icons/AntDesign";

const CartItem = ({ item }) => {
    const dispatch = useDispatch()

    // Handle function for + -
    const handleAddQty = () => {
        dispatch(incrementQuantity(item?._id))
        // if (qty === 10) return alert("you cant add more than 10 quantity");
        // setQty((prev) => prev + 1);
    };

    const handleRemoveQty = () => {
        dispatch(decrementQuantity(item?._id))
        // if (qty <= 1) return;
        // setQty((prev) => prev - 1);
    };

    const handleDelete = () =>{
        dispatch(removeFromCart(item?._id))
    }

    function tronquerTexte(texte, longueurMax) {
        // Vérifie si le texte est plus long que la longueur maximale
        if (texte.length > longueurMax) {
            // Tronque le texte et ajoute des points de suspension
            return texte.substring(0, longueurMax) + '...';
        }
        // Retourne le texte original s'il est plus court que la longueur maximale
        return texte;
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: item?.images[0].url }} style={styles.image} />
            <View style={{width:100, marginLeft:8}}>
                <Text style={styles.name}> {tronquerTexte(item?.name, 16)}</Text>
                <Text style={styles.name}> Price : {item?.price} $</Text>
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btnQty} onPress={handleRemoveQty}>
                    <Text style={styles.btnQtyText}>-</Text>
                </TouchableOpacity>

                <Text>{item.quantity}</Text>

                <TouchableOpacity style={styles.btnQty} onPress={handleAddQty}>
                    <Text style={styles.btnQtyText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width:40, marginHorizontal:8, alignItems:'center', justifyContent:'center'}} onPress={handleDelete}>
                    <FontAwesome name="delete" size={24} color={'red'} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CartItem

const styles = StyleSheet.create({
    container: {
        margin: 10,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },

    image: {
        height: 50,
        width: 50,
        resizeMode: "contain",
    },

    name: {
        fontSize: 10,
    },

    btnContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
        marginHorizontal: 8,
    },

    btnQty: {
        backgroundColor: "lightgray",
        width: 40,
        alignItems: "center",
        marginHorizontal: 10,
    },

    btnQtyText: {
        fontSize: 20,
    },
})