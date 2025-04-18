import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { CartData } from "../data/CartData";
import PriceTable from "../components/cart/PriceTable";
import Layout from "../components/Layout/Layout";
import Cartitem from "../components/cart/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cart/cartSlice";

const Cart = ({ navigation }) => {
    // on récupère les donnée du panier
    const {items, totalQuantity, totalAmount } = useSelector(state =>state.cart)
    const dispatch = useDispatch()
    
    const clear = () =>{
        dispatch(clearCart())
    }
    return (
        <Layout>
            <Text style={styles.heading}>
                {items?.length > 0
                ? `You Have ${totalQuantity} Item Left In Your Cart`
                : "OOPS Your Cart Is EMPTY !"}
            </Text>
                {items?.length > 0 && (
                    <>
                        <View>
                            <PriceTable title={"Price"} price={totalAmount} />
                            <PriceTable title={"Tax"} price={1} />
                            <PriceTable title={"Shipping"} price={1} />
                            <View style={styles.grandTotal}>
                                <PriceTable title={"Grand Total"} price={totalAmount + 1 + 1} />
                            </View>
                        </View>

                        <ScrollView>
                            {items?.map((item, index) => (
                                <Cartitem item={item} key={index} />
                            ))}
                        </ScrollView>

                        <View>
                            <TouchableOpacity
                                style={styles.btnCheckout}
                                onPress={() => navigation.navigate("checkout")}
                            >
                            <Text style={styles.btnCheckoutText}>CHECKOUT</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.btnCheckout}
                                onPress={clear}
                            >
                            <Text style={styles.btnCheckoutText}>CLEAR</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
        </Layout>
    )
}

export default Cart

const styles = StyleSheet.create({
    heading: {
        textAlign: "center",
        color: "green",
        marginTop: 10,
    },

    grandTotal: {
        borderWidth: 1,
        borderColor: "lightgray",
        backgroundColor: "#ffffff",
        padding: 5,
        margin: 5,
        marginHorizontal: 20,
    },

    btnCheckout: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        height: 40,
        backgroundColor: "#000000",
        width: "90%",
        marginHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "lightgray",
    },

    btnCheckoutText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 18,
    },
})