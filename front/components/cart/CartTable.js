import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const CartTable = () => {
    const {items, totalQuantity, totalAmount} = useSelector(state => state.cart);

    return (
        <View style={styles.container}>
            {/* En-tête du tableau */}
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Nom</Text>
                <Text style={styles.headerCell}>Quantité</Text>
                <Text style={styles.headerCell}>Prix Unitaire</Text>
                {/* <Text style={styles.headerCell}>Total</Text> */}
            </View>

            {/* Liste des produits */}
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.name}</Text>
                        <Text style={styles.cell}>{item.quantity}</Text>
                        <Text style={styles.cell}>{item.price.toFixed(2)} €</Text>
                        {/* <Text style={styles.cell}>{(item.quantity * item.price).toFixed(2)} €</Text> */}
                    </View>
                )}
            />
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginHorizontal:25, marginTop:32}}>
                <Text style={{color:'orange', fontSize:16, fontWeight:'bold'}}>Total</Text>
                <Text style={{color:'orange', fontSize:16, fontWeight:'bold'}}>{totalQuantity} </Text>
                <Text style={{color:'orange', fontSize:16, fontWeight:'bold'}}>{totalAmount} $</Text>
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        padding: 10,
        // backgroundColor: '#fff',
        borderRadius: 10,
        // shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
        margin: 10,
        // borderWidth:4,
        width:'100%',
        // paddingHorizontal:25
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 5,
        borderWidth:4
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        // borderWidth:1
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        // borderWidth:1
    },
});

export default CartTable;
