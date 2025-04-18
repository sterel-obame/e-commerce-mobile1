import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import Main from "./Main";
import { QueryClientProvider } from 'react-query';
import queryClient from "./httpRequest/QueryClient";
import { loadCart } from "./redux/cart/cartSlice";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// const queryClient = new QueryClient();

// on charge d'abord le panier
const AppContent = () => {
  const dispatch = useDispatch();

  // Charger le panier au démarrage
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  return <Main />;
};

export default function App() {
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Main />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </Provider>
    </>
  );
}
