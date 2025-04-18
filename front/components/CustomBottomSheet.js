import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useMemo, useCallback, useEffect, ReactNode } from 'react';
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const CustomBottomSheet = ({ customSnapPoints, isOpen, onClose, title, children }) => {
    // ref
    const bottomSheetModalRef = useRef(null);

    // variables
    const snapPoints = useMemo(() => customSnapPoints || ['25%', '50%'], []);

    // Handle opening/closing the bottom sheet based on the isOpen prop
    useEffect(() => {
        if (isOpen) {
            bottomSheetModalRef.current?.present();
        } else {
            bottomSheetModalRef.current?.close();
        }
    }, [isOpen]);

    const handleSheetChanges = useCallback((index) => {
        if(index == -1) {
            onClose();
        }
    }, [])
    console.log(title)
    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={() => (
                <View style={styles.backdrop} />
            )}
        >
            <BottomSheetView>
                <View style={styles.container}>
                    <Pressable
                        style={styles.btn}
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={18} color="black" />
                    </Pressable>
                    <Text style={styles.text}>{title} </Text>
                </View>

                {children}
            </BottomSheetView>
        </BottomSheetModal>
    )
}

export default CustomBottomSheet

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        marginBottom:20,
        paddingHorizontal:25
    },
    btn:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:28,
        height:28,
        borderRadius:50,
        backgroundColor:'lightgray'
    },
    text:{
        textAlign:'center',
        position:'absolute',
        right:0,
        left:0
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Opacité ajustable
    },
})