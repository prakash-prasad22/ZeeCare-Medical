import User from "../models/UserSchema.js"
import Doctor from "../models/DoctorSchema.js"
import Booking from "../models/BookingSchema.js"

export const updateUser = async (req , res) => {
    const id = req.params.id

    try{
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set : req.body },
            {new : true}
        ) ;

        res
            .status(200)
            .json({
                success : true , 
                message : 'User Successfully Updated' , 
                data : updatedUser,
            })

    }catch (err) {
        res
            .status(500)
            .json({
                success : false , 
                message : 'Failed to update'
            })
    }
}


export const deleteUser = async (req , res) => {
    const id = req.params.id

    try{
        await User.findByIdAndDelete(id)

        res
            .status(200)
            .json({
                success : true , 
                message : 'User deleted Successfully' , 
            })

    }catch (err) {
        res
            .status(404)
            .json({
                success : false , 
                message : 'Failed to delete user'
            })
    }
}


export const getSingleUser = async (req , res) => {
    const id = req.params.id

    try{
        const user = await User.findById(id).select("-password");

        res
            .status(200)
            .json({
                success : true , 
                message : 'User Found' , 
                data : user,
            })

    }catch (err) {
        res
            .status(404)
            .json({
                success : false , 
                message : 'No User Found',
            })
    }
}

export const getAllUser = async (req , res) => {
    
    try{
        const users = await User.find({}).select("-password");

        res
            .status(200)
            .json({
                success : true , 
                message : 'Users Found' , 
                data : users,
            })

    }catch (err) {
        res
            .status(404)
            .json({
                success : false , 
                message : 'Not Found',
            })
    }
}

export const getUserProfile = async(req , res) => {

    const userId = req.userId

    try{

        const user = await User.findById(userId);

        if(!user){
            return res
                .status(404)
                .json({
                    success : false , 
                    message : 'User not Found' , 
                })
        }

        const {password , ...rest } = user._doc;

        res
            .status(200)
            .json({
                success : true , 
                message : 'Profile info is being fetched', 
                data : {...rest},
            })

    }catch (err){
        res
            .status(500)
            .json({
                success : false , 
                message : 'Something went wrong , cannot get user data',
            })
    }
}

export const getMyAppointments = async (req,res) => {
    try{

        // step 1 : retrieve appointments from booking for specific user
        const bookings = await Booking.find({ user : req.userId});

        //step 2 : extract doctor ids from appointment bookings
        const doctorIds = await bookings.map(el => el.doctor.id);

        //step 3: retrieve doctors using doctor ids
        const doctors = await Doctor.find({_id : {$in : doctorIds }}).select(
            "-password"
        )

        res
            .status(200)
            .json({
                success : true , 
                message : 'Appointments are being fetched', 
                data : doctors,
            })

    }catch (err){
        res
            .status(500)
            .json({
                success : false , 
                message : 'Something went wrong , cannot get user data',
            })
    }
}