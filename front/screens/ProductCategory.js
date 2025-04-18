import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useEffect } from 'react';
import axiosInstance from '../httpRequest/Request';
import { useQuery } from 'react-query';
import ProductCard from './ProductCard';
import AntDesign from '@expo/vector-icons/AntDesign';

const fetchProductByCategory = async (id) => {
    try {
        const { data } = await axiosInstance.get(`/product/get-by-category/${id}`);
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
};

const ProductCategory = ({ route, navigation }) => {
    const { item } = route.params;
    // Met à jour le titre de la page avec le nom de la catégorie
    useEffect(() => {
        navigation.setOptions({
            title: `${item.name}`,
        });
    }, [navigation, item.name]);

    // Utilisation correcte de useQuery avec une fonction qui retourne fetchProductByCategory
    const { data, isLoading, error, refetch } = useQuery(
        ['getProductByCategory', item._id], // Ajout d'une clé unique et de l'ID de la catégorie
        () => fetchProductByCategory(item._id)
    );

    if (isLoading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size={"large"} color={'black'} />
        </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text>Une erreur est survenue lors du chargement des produits.</Text>
                <TouchableOpacity
                    // style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:150}}
                    onPress={refetch}
                >
                    <AntDesign name="reload1" size={24} color="black" />
                </TouchableOpacity>
            </View>
        );
    }
    
    return (
        
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>{item.name}</Text>
            {data?.products?.length > 0 ? (
                data.products.map((product) => (
                    <ProductCard
                        key={product._id}
                        item={product}
                        name={product?.name}
                        price={product?.price}
                        imageUrl={product?.images[0].url}
                        description={product?.description}
                    />
                ))
            ) : (
                <View style={{height:'100%'}}>
                    <Text>Aucun produit disponible dans cette catégorie.</Text>
                    <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop:50}}>
                        <Image source={require('../assets/vide.jpeg')} style={styles.image} />
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

export default ProductCategory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal:25,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    image: {
        width: 300,
        height: 400,
        resizeMode: 'cover',
        borderRadius: 8,
        // borderWidth:1,
        // borderColor:'lightgray'
    },
});
