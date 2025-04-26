import Joi from "joi";

// Define the validation schema
const addressSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must be at most 30 characters long",
    "any.required": "Name is required",
  }),

  house_no: Joi.string().min(1).required().messages({
    "string.base": "House number must be a string",
    "string.empty": "House number cannot be empty",
    "any.required": "House number is required",
  }),

  city: Joi.string().min(3).max(30).required().messages({
    "string.base": "City must be a string",
    "string.empty": "City cannot be empty",
    "string.min": "City must be at least 3 characters long",
    "string.max": "City must be at most 30 characters long",
    "any.required": "City is required",
  }),

  state: Joi.string().min(3).max(30).required().messages({
    "string.base": "State must be a string",
    "string.empty": "State cannot be empty",
    "string.min": "State must be at least 3 characters long",
    "string.max": "State must be at most 30 characters long",
    "any.required": "State is required",
  }),

  pin_code: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    "string.base": "Pin code must be a string",
    "string.empty": "Pin code cannot be empty",
    "string.length": "Pin code must be exactly 6 digits long",
    "string.pattern.base": "Pin code must contain only numbers",
    "any.required": "Pin code is required",
  }),

  address_type: Joi.string().valid("home", "office", "other").required().messages({
    "string.base": "Address type must be a string",
    "any.required": "Address type is required",
    "any.only": "Address type must be one of 'home', 'office', or 'other'",
  }),

  landmark: Joi.string().max(100).optional().messages({
    "string.base": "Landmark must be a string",
    "string.max": "Landmark cannot be more than 100 characters",
  }),

  mobile_number: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    "string.base": "Mobile number must be a string",
    "string.pattern.base": "Mobile number must be exactly 10 digits",
    "any.required": "Mobile number is required",
  }),

  alternate_number: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
    "string.base": "Alternate number must be a string",
    "string.pattern.base": "Alternate number must be exactly 10 digits",
  }),
});

export default addressSchema