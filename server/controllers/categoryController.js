import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import mongoose from 'mongoose';


// CREAT CAT
export const createCategory = async (req, res) => {
    try {
        const { category, categoryDescription } = req.body;
        // validation
        if (!category) {
        return res.status(404).send({
            success: false,
            message: "please provide category name",
        });
        }
        await categoryModel.create({ category, categoryDescription });
        res.status(201).send({
            success: true,
            message: `${category} category and ${categoryDescription} creted successfully`,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Create Cat API",
        });
    }
};
/*
l'URL sera sous cette forme: http://localhost:8080/api/v1/cat/create
l'objet pour créer une catégorie sera sous cette forme
{
    "category":"mobile",
    "categoryDescription":"c'est juste la catégorie des téléphones mobiles"
}
*/

// GET ALL CAT
export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "Categories Fetch Successfully",
            totalCat: categories.length,
            categories,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
                success: false,
                message: "Error In Get All Cat API",
            });
    }
};
/*
l'URL sera sous cette forme: http://localhost:8080/api/v1/cat/get-all
*/

// DELETE CATEGORY
export const deleteCategoryController = async (req, res) => {
    try {
        // find category
        const category = await categoryModel.findById(req.params.id);
        //validation
        if (!category) {
        return res.status(404).send({
            success: false,
            message: "Category not found",
        });
        }
        // find product with this category id
        const products = await productModel.find({ category: category._id });
        // update producty category
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = undefined;
            await product.save();
        }
        // save
        await category.deleteOne();
        res.status(200).send({
            success: true,
            message: "Catgeory Deleted Successfully",
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
            message: "Error In DELETE CAT API",
            error,
        });
    }
};
/*
l'URL sera sous cette forme: http://localhost:8080/api/v1/cat/delete
*/

// UDPATE CAT: METTRE A JOUR LE CHAMP CATEGORY DU PRODUIT
export const updateCategoryController = async (req, res) => {
    try {
        // find category
        const category = await categoryModel.findById(req.params.id);
        //validation
        if (!category) {
        return res.status(404).send({
            success: false,
            message: "Category not found",
        });
        }
        // get new cat
        const { updatedCategory } = req.body;
        // find product with this category id
        const products = await productModel.find({ category: category._id });
        // update producty category
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = updatedCategory;
            await product.save();
        }
        if (updatedCategory) category.category = updatedCategory;

        // save
        await category.save();
        res.status(200).send({
            success: true,
            message: "Catgeory Updated Successfully",
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
            message: "Error In UPDATE CATEGPORY API",
            error,
        });
    }
};
/*
L'objet aura cette forme
{
    "updatedCategory":"nomCategory"
}
*/

//mettre à la catégorie et sa descripton
export const updateFullCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                success: false,
                message: "Invalid Category ID",
            });
        }

        const { category, categoryDescription } = req.body;
        // Mise à jour du produit
        const updateCategory = await categoryModel.findByIdAndUpdate(
            {_id: id},
            { category, categoryDescription },
            { new: true, runValidators: true, context: 'query' } // `new: true` retourne l'objet mis à jour, `runValidators: true` exécute les validateurs du modèle
        );

        // Validation de l'existence du produit
        if (!updateCategory) {
            return res.status(404).send({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Category details updated successfully",
            product: updateCategory,
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
/*
l'URL sera de cette forme: http://localhost:8080/api/v1/cat/update-all/66ff1fb25eb628cc7b43fc0c
et l'objet sera de cette forme
{
    "category":"telephone",
    "categoryDescription":"c'est une catégorie de téléphone mobile qu'on vient de mettre à jour"
}
*/