import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';


export default function ProductCard({ name, price, imageUrl, description, item }) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const dispatch = useDispatch()

    const addProductToCart = () =>{
        dispatch(addToCart(item))
    }
    
    const maxLength = 150 
    // Vérifie si la description est trop longue pour être tronquée
    const shouldTruncate = description.length > maxLength;

    // Texte à afficher (complet ou tronqué)
    const displayedDescription = showFullDescription? description: `${description.slice(0, maxLength)}${shouldTruncate ? '...' : ''}`;
    return (
        <View style={styles.card}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.price}><Text style={{fontWeight:'bold', color:'black'}}>Prix:</Text> {price && price.toFixed(2)} €</Text>
                <Text style={styles.price}><Text style={{fontWeight:'bold', color:'black'}}>Description:</Text> {description && displayedDescription} </Text>
                {/* Boutons "Afficher plus" ou "Afficher moins" */}
                {shouldTruncate && (
                    <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                        <Text style={{fontWeight:'bold', color:'orange', paddingVertical:8}}>
                            {showFullDescription ? 'Afficher moins' : 'Afficher plus'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity 
                style={styles.button} 
                onPress={addProductToCart}
            >
                <Text style={styles.buttonText}>Ajouter au panier</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        marginBottom:20
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
        borderWidth:1,
        borderColor:'lightgray'
    },
    info: {
        marginTop: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        color: '#888',
    },
    button: {
        backgroundColor: 'lightgray',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});