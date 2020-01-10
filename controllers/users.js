const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const User = require('../models/User');

module.exports = {
    /**
     * @desc   Get all user
     * @route  Get /api/v1/users
     * @access Private/Admin
     */

    getUsers: asyncHandler(async (req, res, next) => {
        res.status(200).json(res.advancedResults)
    }),
    /**
     * @desc   Get a single user
     * @route  Get /api/v1/users/:id
     * @access Private/Admin
     */

    getUser: asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.params.id);

        res.status(200).json({
            success: true,
            data: { user }
        })
    }),
    /**
     * @desc   Create user
     * @route  POST /api/v1/users
     * @access Private/Admin
     */

    createUser: asyncHandler(async (req, res, next) => {
        const user = await User.create(req.body);

        res.status(201).json({
            success: true,
            data: { user }
        })
    }),
    /**
     * @desc   Update user
     * @route  Put /api/v1/users/:id
     * @access Private/Admin
     */

    updateUser: asyncHandler(async (req, res, next) => {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        
        res.status(200).json({
            success: true,
            data: {
                user
            }
        })

    }),
    /**
     * @desc   Delete user
     * @route  DELETE /api/v1/users/:id
     * @access Private/Admin
     */

    deleteUser: asyncHandler(async (req, res, next) => {
        const result = await User.deleteOne({_id: req.params.id});

        if(!result.n){
            throw new ErrorResponse(`User with id ${req.params.id} doesn't exist`, 404);
        }
        
        res.status(200).json({
            success: true,
            data: {
            }
        })

    }),

};