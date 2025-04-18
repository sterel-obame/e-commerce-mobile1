import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useSelector } from "react-redux";
import CartTable from "../components/cart/CartTable";
import CustomBottomSheet from "../components/CustomBottomSheet";

const Checkout = ({ navigation }) => {
    const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
    const snapPointsDelete = useMemo(() => ['50%', '95%'], []);
    const {items, totalQuantity, totalAmount} = useSelector((state=>state.cart))

    const toggleBottomSheet = () => {
        setBottomSheetOpen(!isBottomSheetOpen);
    };

    const onCloseBottomSheet = () => {
        setBottomSheetOpen(false);
    };
    const handleCOD = () => {
        alert("Your Order Has Been Placed Successfully");
    };
    const handleOnline = () => {
        alert("Your Redirecting to payment gateway");
        navigation.navigate("payment");
    };
    return (
        <Layout>
            <View style={Styles.container}>
                <Text style={Styles.heading}>Options de paiement</Text>
                <Text style={Styles.price}>Montant total : {totalAmount && totalAmount}$</Text>
                <CartTable />

                <View>
                    <TouchableOpacity
                        onPress={toggleBottomSheet}
                    >
                        <Text>Adresse</Text>
                    </TouchableOpacity>
                </View>
                <View style={Styles.paymentCard}>
                    <Text style={Styles.paymentHeading}>Sélectionnez votre mode de paiement</Text>
                    <TouchableOpacity style={Styles.paymentBtn} onPress={handleCOD}>
                        <Text style={Styles.paymentBtnText}>Cash à la livraison</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.paymentBtn} onPress={handleOnline}>
                        <Text style={Styles.paymentBtnText}>
                        En ligne (CREDIT | CARTE DE DÉBIT)
                        </Text>
                    </TouchableOpacity>
                </View>

                <CustomBottomSheet isOpen={isBottomSheetOpen} onClose={onCloseBottomSheet} title='adresse' customSnapPoints={snapPointsDelete}>
                    <View>
                        <Text>BottomSheet</Text>
                    </View>
                </CustomBottomSheet>
            </View>
        </Layout>
    )
}

export default Checkout

const Styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        height: "90%",
        flex:1,
    },

    heading: {
        fontSize: 30,
        fontWeight: "500",
        marginVertical: 10,
    },

    price: {
        fontSize: 20,
        marginBottom: 10,
        color: "gray",
    },

    paymentCard: {
        backgroundColor: "#ffffff",
        width: "90%",
        borderRadius: 10,
        padding: 30,
        marginVertical: 10,
    },

    paymentHeading: {
        color: "gray",
        marginBottom: 10,
    },

    paymentBtn: {
        backgroundColor: "lightgray",
        height: 40,
        borderRadius: 10,
        justifyContent: "center",
        marginVertical: 10,
    },

    paymentBtnText: {
        color: "black",
        textAlign: "center",
        fontWeight:'bold',
        fontSize:16
    },
})