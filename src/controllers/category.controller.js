//   createCategory,
//   updateCategory,
//   removeCategory,
//   listCategory,
//   readCategory,

import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/Categories.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  console.log(name)

  try {

    if (!name) {
      throw new ApiError(400, "Name is required");
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      throw new ApiError(409, "Category already exists");
    }

    const newCategory = new Category({ name });

    const savedCategory = await newCategory.save();

    return res
    .status(201)
    .json(
      new ApiResponse(201, savedCategory, "Category created successfully")
    )
  } catch (error) {
    console.log("Error while creating category:", error);
    throw new ApiError(500, "Could not create the category, server error");
  }
});

const deleteCategory = asyncHandler( async (req, res) => {
  const { _id } = req.params
  console.log(_id)
  try {
    if(!mongoose.Types.ObjectId.isValid(_id)){
      throw new ApiError(404, "Invaild categoryId")
    }

    const category = await Category.findByIdAndDelete(_id)

    if(!category){
      throw new ApiError(404, "Category not found")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Category deleted successfully")
    )

  } catch (error) {
    console.log("Error while deleting category:", error);
    throw new ApiError(500, "Could not delete the category, server error");
  } 
})

const viewAllCategory = asyncHandler( async (req, res) => {
try {
  const category = await Category.find()

  if(!category){
    throw new ApiError(404, "No categories found")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, category, "All categories fetched successfully")
  )

} catch (error) {
  console.log("Error while fetching categories:", error);
  throw new ApiError(500, "Could not find the categories, server error");
}
})

const viewCategory = asyncHandler( async (req, res) => {
  const {_id} = req.params
try {

  if(!mongoose.Types.ObjectId.isValid(_id)){
    throw new ApiError(404, "Invaild categoryId")
  }

  const category = await Category.findById(_id)

  if(!category){
    throw new ApiError(404, "No categories found")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, category, "All category fetched successfully")
  )

} catch (error) {
  console.log("Error while fetching category:", error);
  throw new ApiError(500, "Could not find the category, server error");
}
})

const editCategory = asyncHandler( async (req, res) => {
const {_id} = req.params
const name = req.body
try {
  if(!mongoose.Types.ObjectId.isValid(_id)){
    throw new ApiError(404, "Invaild categoryId")
  }
  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  const category = await Category.findByIdAndUpdate(_id, name, {
    new: true
  })

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, category, "Category updated successfully")
  )

} catch (error) {
  console.log("Error while updating category:", error);
  throw new ApiError(500, "Could not update the category, server error");
}
})

export {
  createCategory,
  deleteCategory,
  viewCategory,
  editCategory,
  viewAllCategory
}