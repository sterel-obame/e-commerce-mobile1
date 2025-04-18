import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { stripe } from "../server.js";

// CREATE ORDERS
export const createOrderController = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        } = req.body;
        //valdiation
        // create order
        await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        });

        // stock update
        for (let i = 0; i < orderItems.length; i++) {
            // find product
            const product = await productModel.findById(orderItems[i].product);
            product.stock -= orderItems[i].quantity;
            await product.save();
        }
        res.status(201).send({
            success: true,
            message: "Order Placed Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Create Order API",
            error,
        });
    }
};
/*
un objet très compliqué voici un exemple que j'ai obtenu en envoyant tout le modèle OrderModel à l'IA
{
    "shippingInfo": {
        "address": "123 Rue Sidi Maarouf",
        "city": "Casablanca",
        "country": "Maroc"
    },
    "orderItems": [
        {
            "name": "Nokia N95",
            "price": 100,
            "quantity": 2,
            "image": "https://res.cloudinary.com/dw2yxpsnz/image/upload/v1727286779/smztsygridw8nkuivmgi.jpg",
            "product": "66f44dfc01c8de1bb343a79e"
        }
    ],
    "paymentMethod": "COD",
    "user": "66f2fe3c80c4f077e40e9f05",
    "itemPrice": 200,
    "tax": 20,
    "shippingCharges": 10,
    "totalAmount": 230,
    "orderStatus": "processing"
}
*/

// GET ALL ORDERS - MY ORDERS
export const getMyOrdersCotroller = async (req, res) => {
    try {
        // find orders
        const orders = await orderModel.find({ user: req.user._id });
        //valdiation
        if (!orders) {
        return res.status(404).send({
            success: false,
            message: "no orders found",
        });
        }
        res.status(200).send({
            success: true,
            message: "your orders data",
            totalOrder: orders.length,
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In My orders Order API",
            error,
        });
    }
};

// GET SINGLE ORDER INFO
export const singleOrderDetrailsController = async (req, res) => {
    try {
        // find orders
        const order = await orderModel.findById(req.params.id);
        //valdiation
        if (!order) {
        return res.status(404).send({
            success: false,
            message: "no order found",
        });
        }
        res.status(200).send({
            success: true,
            message: "your order fetched",
            order,
        });
    } catch (error) {
        console.log(error);
        // cast error ||  OBJECT ID
        if (error.name === "CastError") {
        return res.status(500).send({
            success: false,
            message: "Invalid Id",
        });
        }
        res.status(500).send({
            success: false,
            message: "Error In Get UPDATE Products API",
            error,
        });
    }
};

// ACCEPT PAYMENTS LE SYSTEME DE PAYEMENT AVEC STRIPE
// cette méthode permet de valider le payement d'un client vers stripe
export const paymentsController = async (req, res) => {
    try {
        // get ampunt
        const { totalAmount } = req.body;
        // validation
        if (!totalAmount) {
            return res.status(404).send({
                success: false,
                message: "Total Amount is required",
            });
        }
        // la monaie par défaut est le "usd"
        const { client_secret } = await stripe.paymentIntents.create({
            amount: Number(totalAmount * 100),
            currency: "usd",
        });
        res.status(200).send({
            success: true,
            client_secret,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get UPDATE Products API",
            error,
        });
    }
};
/*
l'objet sera comme suite:
{
    "totalAmount": un nombre
}
*/
// ========== ADMIN SECTION =============

// GET ALL ORDERS
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).send({
            success: true,
            message: "All Orders Data",
            totalOrders: orders.length,
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get UPDATE Products API",
            error,
        });
    }
};

// CHANGE ORDER STATUS
export const changeOrderStatusController = async (req, res) => {
    try {
        // find order
        const order = await orderModel.findById(req.params.id);
        // validatiom
        if (!order) {
        return res.status(404).send({
            success: false,
            message: "order not found",
        });
        }

        // ici on va vérifier le statut de la commande, si le satut est "processing(en cours)",
        // dans ce cas la requête effectuée va changer le statut en le mettant à "shipped (livré)"
        if (order.orderStatus === "processing") order.orderStatus = "shipped";

        // ici si le statut est à "shipped" dans ce cas il va passer à "delivered" et on ajoute la date actuelle
        else if (order.orderStatus === "shipped") {
            order.orderStatus = "deliverd";
            order.deliverdAt = Date.now();
        } else {
            return res.status(500).send({
                success: false,
                message: "order already deliverd",
            });
        }

        await order.save();
        res.status(200).send({
            success: true,
            message: "order status updated",
        });
    } catch (error) {
        console.log(error);
        // cast error ||  OBJECT ID
        if (error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id",
            });
        }
        res.status(500).send({
            success: false,
            message: "Error In Get UPDATE Products API",
            error,
        });
    }
};
/*
l'URL aura cette forme: http://localhost:8080/api/v1/order/admin/order/66ff3526d02e94d8bb9be617

*/