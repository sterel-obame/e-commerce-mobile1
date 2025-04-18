import productModel from "../models/productModel.js";
import mongoose from 'mongoose';
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/Features.js";
import categoryModel from "../models/categoryModel.js";

// GET ALL PRODUCTS
export const getAllProductsController = async (req, res) => {
    const { keyword, category } = req.query;
    try {
        // la partie commentée en bas-là permet de faire des recherches
        const products = await productModel
        // .find({
        //     name: {
        //         $regex: keyword ? keyword : "",
        //         $options: "i",
        //     },
        //     category: category ? category : null,
        // })
        .find()
        .populate("category");
        res.status(200).send({
            success: true,
            message: "all products fetched successfully",
            totalProducts: products.length,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get All Products API",
            error,
        });
    }
};

// GET PRODUCT BY CATEGORY
export const getProductByCategoryController = async (req, res) =>{
    try {
        // const { categoryName } = req.params;
        // console.log("ce qu'on reçoit", req.params.id)
        // Vérification si la catégorie existe
        const category = await categoryModel.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Récupérer les produits associés à cette catégorie
        const products = await productModel
        .find({ category: category._id })
        .populate("category");

        if (products.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No products found for this category",
                products: [],
            });
        }

        res.status(200).json({
            success: true,
            totalProducts: products.length,
            message: `Products for category: ${category.category}`,
            products,
        });
    } catch (error) {
        console.error("Error retrieving products by category:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving products by category",
            error,
        });
    }
}
// GET TOP PRODUCT
export const getTopProductsController = async (req, res) => {
    try {
        const products = await productModel.find({}).sort({ rating: -1 }).limit(3);
        res.status(200).send({
            success: true,
            message: "top 3 products",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get TOP PRODUCTS API",
            error,
        });
    }
};

// GET SINGLE PRODUCT
export const getSingleProductController = async (req, res) => {
    try {
        // get product id
        const product = await productModel.findById(req.params.id);
        //valdiation
        if (!product) {
        return res.status(404).send({
            success: false,
            message: "product not found",
        });
        }
        res.status(200).send({
            success: true,
            message: "Product Found",
            product,
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
            message: "Error In Get single Products API",
            error,
        });
    }
};

// CREATE PRODUCT
export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        
        // Validation des champs obligatoires
        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields, including category",
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please provide product images",
            });
        }
        
        // Gestion des images
        const file = getDataUri(req.file);
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        };

        // Vérification ou création de la catégorie
        let categoryDoc = await categoryModel.findOne({ category: category });
        if (!categoryDoc) {
            categoryDoc = await categoryModel.create({ category: category });
        }

        // Création du produit
        const product = await productModel.create({
            name,
            description,
            price,
            category: categoryDoc._id, // Associe l'ID de la catégorie
            stock,
            images: [image],
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product, // On peut aussi renvoyer les détails du produit créé
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Error creating product",
            error,
        });
    }
};
/*
l'objet sera comme suite
{
    "name":" quel que chose", 
    "description":" quel que chose", 
    "price":" quel que chose", 
    "category":" quel que chose", //la valeur de catégorie doit être un un id mongoose
    "stock":" quel que chose",
    "file":"image"
}
*/

// UPDATE PRODUCT
export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid Product ID",
            });
        }

        const { name, description, price, stock, category } = req.body;

        // Mise à jour du produit
        const updatedProduct = await productModel.findByIdAndUpdate(
            {_id: id},
            { name, description, price, stock, category },
            { new: true, runValidators: true, context: 'query' } // `new: true` retourne l'objet mis à jour, `runValidators: true` exécute les validateurs du modèle
        );

        // Validation de l'existence du produit
        if (!updatedProduct) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Product details updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in updating product",
            error,
        });
    }
};
// l'objet sera l'ensemble des champs qu'on voudra mettre à jour


// UPDATE PRODUCT IMAGE
export const updateProductImageController = async (req, res) => {
    try {
        // find product
        const product = await productModel.findById(req.params.id);
        // valdiation
        if (!product) {
        return res.status(404).send({
            success: false,
            message: "Product not found",
        });
        }
        // check file
        if (!req.file) {
        return res.status(404).send({
            success: false,
            message: "Product image not found",
        });
        }

        const file = getDataUri(req.file);
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url,
        };
        // save
        product.images.push(image);
        await product.save();
        res.status(200).send({
            success: true,
            message: "product image updated",
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
// c'est juste l'image qu'on met à jour d'où on utilise "file"

// DELETE PRODUCT IMAGE
export const deleteProductImageController = async (req, res) => {
    try {
        // find produtc
        const product = await productModel.findById(req.params.id);
        console.log(product)
        // validatin
        if (!product) {
        return res.status(404).send({
            success: false,
            message: "Product Not Found",
        });
        }

        // image id find
        const id = req.query.id;
        if (!id) {
            return res.status(404).send({
                success: false,
                message: "product image not found",
            });
        }

        let isExist = -1;
        product.images.forEach((item, index) => {
            if (item._id.toString() === id.toString()) isExist = index;
        });

        if (isExist < 0) {
        return res.status(404).send({
            success: false,
            message: "Image Not Found",
        });
        }
        // DELETE PRODUCT IMAGE
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
        product.images.splice(isExist, 1);
        await product.save();
        return res.status(200).send({
            success: true,
            message: "Product Image Dleteed Successfully",
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
            message: "Error In Get DELETE Product IMAGE API",
            error,
        });
    }
};
/*
    pour faire cette requête, on va d'abord utiliser l'id du produit et ensuite on va utiliser un paramètre
    le paramètre utilisé sera l'id de l'image ça va donner
    http://localhost:8080/api/v1/product/delete-image/id du produit?id=valeur de l'id de l'image
*/
// DLEETE PRODUCT
export const deleteProductController = async (req, res) => {
    try {
        // find product
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "product not found",
            });
        }
        // find and delete image cloudinary
        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id);
        }
        await product.deleteOne();
        res.status(200).send({
            success: true,
            message: "PRoduct Deleted Successfully",
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
            message: "Error In Get DELETE Product IMAGE API",
            error,
        });
    }
};

// CREATE PRODUCT REVIEW AND COMMENT
export const productReviewController = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        // find product
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "product not found",
            });
        }
        // check previous review
        const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
            return res.status(400).send({
                success: false,
                message: "Product Alredy Reviewed",
            });
        }
        // review object
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        // passing review object to reviews array
        product.reviews.push(review);
        // number or reviews
        product.numReviews = product.reviews.length;
        product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
        // save
        await product.save();
        res.status(200).send({
            success: true,
            message: "Review Added!",
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
            message: "Error In Review Comment API",
            error,
        });
    }
};
/*
l'URL aura cette forme : http://localhost:8080/api/v1/product/66fd80b9f8a332a6663abb61/review
l'objet sera cette forme:
{
    "comment":"très cool",
    "rating":5
}
*/
// ========== PRODUCT CTRL ENDS ================
