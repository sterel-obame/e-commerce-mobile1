import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, loadCart } from "../redux/cart/cartSlice";

const ProductDetails = ({ route }) => {
    const {items, totalQuantity, totalAmount } = useSelector((state)=>state.cart)
    const { params } = route;
    const dispatch = useDispatch();
    

    // Charger le panier depuis AsyncStorage au démarrage
    useEffect(() => {
        dispatch(loadCart());
    }, [dispatch]);
    const ajouter = () =>{
        dispatch(addToCart(params.item))

    }
    return (
        <Layout>
            <ScrollView
                // contentContainerStyle={{borderWidth:4}}
            >
                <Image 
                    source={{ uri: params?.item.images[0].url }} 
                    style={styles.image} 
                    resizeMode="contain" 
                />
                <View style={styles.container}>
                <Text style={styles.title}>{params?.item.name}</Text>
                <Text style={styles.price}>Prix : {params?.item.price} $</Text>
                <Text style={styles.desc}>Description : {params?.item.description}</Text>

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={styles.btnCart}
                        onPress={ajouter}
                        // disabled={params?.item.quantity <= 0}
                    >
                        <Text style={styles.btnCartText}>
                            Ajouter au panier
                        </Text>
                    </TouchableOpacity>

                    {/* <View style={styles.qtyControl}>
                        <TouchableOpacity style={styles.btnQty} onPress={handleRemoveQty}>
                            <Text style={styles.btnQtyText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{qty}</Text>

                        <TouchableOpacity style={styles.btnQty} onPress={handleAddQty}>
                            <Text style={styles.btnQtyText}>+</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
                </View>
            </ScrollView>
        </Layout>
    );
};

export default ProductDetails;

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: "100%",
        marginVertical: 10,
    },

    container: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "left",
    },

    price: {
        fontSize: 18,
        color: "#333",
        marginBottom: 8,
    },

    desc: {
        fontSize: 14,
        textAlign: "justify",
        lineHeight: 20,
        marginVertical: 10,
    },

    btnContainer: {
        marginTop: 20,
        alignItems: "center",
    },

    btnCart: {
        backgroundColor: "lightgray",
        borderRadius: 5,
        width: "80%",
        height: 45,
        justifyContent: "center",
        marginBottom: 20,
    },

    btnCartText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },

    qtyControl: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    btnQty: {
        backgroundColor: "lightgray",
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
        borderRadius: 5,
    },

    btnQtyText: {
        fontSize: 20,
        fontWeight: "bold",
    },

    qtyText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
