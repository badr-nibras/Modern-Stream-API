const { string } = require('@hapi/joi')
const Joi = require('@hapi/joi')

exports.userRegister = Joi.object({
    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string().min(10).required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required(),
    address: Joi.string().required()
})

exports.userLogin = Joi.object({
    login: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
})

exports.adminRegister = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.string().min(10).required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required(),
    address: Joi.string().required(),
    isAdmin: Joi.boolean().required(),
})

exports.adminLogin = Joi.object({
    login: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
})
