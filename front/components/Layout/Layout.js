import { View, StatusBar, StyleSheet, ScrollView } from "react-native";
import React from "react";
import Footer from "./Footer";

const Layout = ({children}) => {
    return (
        <>
            {/* c'est la couleur du backgroundColor qui donne cette couleur à la barre de navigation du haut */}
            <StatusBar backgroundColor="#61dafb" />
            <View style={styles.container}>
                <ScrollView style={styles.content}>
                    {children}
                </ScrollView>
                <Footer />
            </View>
        </>
    )
}

export default Layout

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    footer: {
        display: "flex",
        width: "100%",
        flex: 1,
        justifyContent: "flex-end",
        zIndex: 100,
        borderTopWidth: 1,
        borderColor: "lightgray",
        position: "absolute",
        bottom: 0,
        padding: 10,
    },
})