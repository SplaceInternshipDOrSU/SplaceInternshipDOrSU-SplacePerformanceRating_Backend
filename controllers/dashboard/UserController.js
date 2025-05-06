const { responseReturn } = require("../../utils/response")
const userModel = require('../../models/userModel') 
const mongoose = require('mongoose');
// const traderModel = require("../../models/traderModel")
// const sellerModel = require('../../models/sellerModel') 
// const traderModel = require("../../models/traderModel")

class userController {  
    escapeRegex = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    
    get_user_requests = async (req, res) => {
        let { page, parPage, searchValue, role, category } = req.query;

        console.log(req.query)
        console.log("req.query")
    
        // Safe casting and limits
        const MAX_PER_PAGE = 100;
        page = Math.max(parseInt(page) || 1, 1);
        parPage = Math.min(Math.max(parseInt(parPage) || 10, 1), MAX_PER_PAGE);
        const skipPage = parPage * (page - 1);
    
        try {
            const query = { status: 'pending' };
    
            // Search filter
            if (searchValue && searchValue.trim() !== '') {
                const safeRegex = new RegExp(this.escapeRegex(searchValue), 'i');
                query.$or = [
                    { firstName: safeRegex },
                    { middleName: safeRegex },
                    { lastName: safeRegex },
                ];
            }
    
            // Role filter (must be valid ObjectId)
            if (role && mongoose.Types.ObjectId.isValid(role)) {
                query.role = new mongoose.Types.ObjectId(role);
            }
    
            // Category filter (must be valid ObjectId)
            if (category && mongoose.Types.ObjectId.isValid(category)) {
                query.category = new mongoose.Types.ObjectId(category);
            }
    
            let users = await userModel.find(query)
                .skip(skipPage)
                .limit(parPage)
                .sort({ createdAt: -1 })
                .populate('role', 'name')
                .populate('category', 'name');
    
            users = users.map((user, index) => ({
                ...user.toObject(),
                role: user.role ? user.role.name : "Deleted Role",
                category: user.category ? user.category.name : "Deleted Category",
                number: skipPage + index + 1  // Add numbering here (starts at 1 across pages)
            }));
    
            const totalUsers = await userModel.countDocuments(query);
            const totalPages = Math.ceil(totalUsers / parPage);
    
            responseReturn(res, 200, {
                totalUsers,
                totalPages,
                currentPage: page,
                perPage: parPage,
                users
            });
        } catch (error) {
            console.error("Error fetching user requests:", error.stack);
            responseReturn(res, 500, { message: "Server Error" });
        }
    };
    
    get_user = async (req, res) => {
        const { userId } = req.params

        try {
            const user = await userModel.findById(userId)
            responseReturn(res, 200, { user })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    user_status_update = async (req, res) => {
        const { userId, status } = req.body;
    
        try {
            // Check if the seller exists
            const seller = await userModel.findById(userId);
            if (!seller) {
                return responseReturn(res, 404, { message: "User not found" });
            }
    
            // Update the seller's status
            seller.status = status;
            await seller.save();
    
            // // Update listings based on the seller's new status
            // if (status !== "active") {
            //     await Listing.updateMany({ userId }, { isAvailable: false });
            // } else {
            //     await Listing.updateMany({ userId }, { isAvailable: true });
            // }
    
            // Return the updated seller
            const updatedUser = await userModel.findById(userId);
            responseReturn(res, 200, { user: updatedUser, message: "User status updated successfully" });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_active_users = async (req, res) => {
        console.log("get_active_users");
    
        const { page, searchValue, parPage, role, category } = req.query;
        console.log("req.query", req.query);
    
        try {
            // Parse and sanitize pagination parameters
            const pageNum = Math.max(1, parseInt(page) || 1); // Ensure page is at least 1
            const perPage = parseInt(parPage) || 10;          // Default to 10 per page
            const skip = perPage * (pageNum - 1);             // Calculate skip for pagination
    
            // Build query
            const query = { status: 'active' };
    
            // Search filter
            if (searchValue && searchValue.trim() !== '') {
                const searchRegex = new RegExp(searchValue, 'i');
                query.$or = [
                    { firstName: searchRegex },
                    { middleName: searchRegex },
                    { lastName: searchRegex },
                    { email: searchRegex },
                    {  status: searchRegex },
                ];
            }
    
            // Role filter (must be valid ObjectId)
            if (role && mongoose.Types.ObjectId.isValid(role)) {
                query.role = new mongoose.Types.ObjectId(role);
            }
    
            // Category filter (must be valid ObjectId)
            if (category && mongoose.Types.ObjectId.isValid(category)) {
                query.category = new mongoose.Types.ObjectId(category);
            }
    
            // Fetch users with populated role and category
            let users = await userModel.find(query)
                .skip(skip)
                .limit(perPage)
                .sort({ createdAt: -1 })
                .populate('role', 'name')
                .populate('category', 'name');
    
            // Count total number of matching users
            const totalUsers = await userModel.countDocuments(query);
            const totalPages = Math.ceil(totalUsers / perPage);  // Calculate total pages
    
            // Map users and add numbering
            users = users.map((user, index) => {
                return {
                    no: skip + index + 1, // numbering starts at 1 across pages
                    ...user.toObject(),
                    role: user.role ? user.role.name : "Deleted Role",
                    category: user.category ? user.category.name : "Deleted Category"
                };
            });
    
            console.log("Users fetched successfully");
    
            // Send back users and pagination info
            return responseReturn(res, 200, {
                totalUsers,
                totalPages,
                currentPage: pageNum,
                perPage,  // still returning as perPage for frontend to handle
                users,
            });
        } catch (error) {
            console.error("Error fetching active Users:", error.stack);
            return responseReturn(res, 500, { error: "Internal server error" });
        }
    };
    

      






    // get_trader_request = async (req, res) => {
    //     console.log("asdasdasd")
    //     const { page, searchValue, parPage } = req.query
    //     const skipPage = parseInt(parPage) * (parseInt(page) - 1)
    //     try {
    //         if (searchValue) {
    //             //const seller
    //         } else {
    //             const traders = await traderModel.find({ status: 'pending' }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
    //             const totalTraders = await traderModel.find({ status: 'pending' }).countDocuments()
    //             responseReturn(res, 200, { totalTraders, traders })
    //         }
    //     } catch (error) {
    //         console.log()
    //         responseReturn(res, 500, { error: error.message })
    //     }
    // }
    // get_seller = async (req, res) => {
    //     const { sellerId } = req.params

    //     try {
    //         const seller = await sellerModel.findById(sellerId)
    //         responseReturn(res, 200, { seller })
    //     } catch (error) {
    //         responseReturn(res, 500, { error: error.message })
    //     }
    // }
    // get_trader = async (req, res) => {
    //     const { traderId } = req.params

    //     try {
    //         const trader = await traderModel.findById(traderId)
    //         responseReturn(res, 200, { trader })
    //     } catch (error) {
    //         responseReturn(res, 500, { error: error.message })
    //     }
    // }
    // seller_status_update = async (req, res) => {
    //     const { sellerId, status } = req.body;
    
    //     try {
    //         // Check if the seller exists
    //         const seller = await sellerModel.findById(sellerId);
    //         if (!seller) {
    //             return responseReturn(res, 404, { message: "Seller not found" });
    //         }
    
    //         // Update the seller's status
    //         seller.status = status;
    //         await seller.save();
    
    //         // Update listings based on the seller's new status
    //         if (status !== "active") {
    //             await Listing.updateMany({ sellerId }, { isAvailable: false });
    //         } else {
    //             await Listing.updateMany({ sellerId }, { isAvailable: true });
    //         }
    
    //         // Return the updated seller
    //         const updatedSeller = await sellerModel.findById(sellerId);
    //         responseReturn(res, 200, { seller: updatedSeller, message: "Seller status updated successfully" });
    //     } catch (error) {
    //         responseReturn(res, 500, { error: error.message });
    //     }
    // };
    // trader_status_update = async (req, res) => {
    //     const { traderId, status } = req.body;
    
    //     try {
    //         // Check if the seller exists
    //         const trader = await traderModel.findById(traderId);
    //         if (!trader) {
    //             return responseReturn(res, 404, { message: "Trader not found" });
    //         }
    
    //         // Update the seller's status
    //         trader.status = status;
    //         await trader.save();
    
    //         // // Update listings based on the seller's new status
    //         // if (status !== "active") {
    //         //     await Listing.updateMany({ sellerId }, { isAvailable: false });
    //         // } else {
    //         //     await Listing.updateMany({ sellerId }, { isAvailable: true });
    //         // }
    
    //         // Return the updated seller
    //         const updatedTrader = await traderModel.findById(traderId);
    //         responseReturn(res, 200, { trader: updatedTrader, message: "Trader status updated successfully" });
    //     } catch (error) {
    //         responseReturn(res, 500, { error: error.message });
    //     }
    // };
    // get_active_sellers = async (req, res) => {
    //     let { page, searchValue, parPage } = req.query;
    
    //     // Validate query params
    //     page = parseInt(page) || 1;
    //     parPage = parseInt(parPage) || 10;
    
    //     const skipPage = parPage * (page - 1);
    
    //     try {
    //         // Build dynamic query
    //         const query = { status: 'active' };
    
    //         if (searchValue) {
    //             query.$or = [
    //                 { firstName: { $regex: searchValue, $options: "i" } },
    //                 { middleName: { $regex: searchValue, $options: "i" } },
    //                 { lastName: { $regex: searchValue, $options: "i" } },
    //                 { associationName: { $regex: searchValue, $options: "i" } },
    //             ];
    //         }
    
    //         // Fetch data with pagination and sorting
    //         const sellers = await sellerModel.find(query)
    //             .skip(skipPage)
    //             .limit(parPage)
    //             .sort({ createdAt: -1 });
    
    //         // Count total sellers matching the query
    //         const totalSeller = await sellerModel.countDocuments(query);
    
    //         // Return response
    //         responseReturn(res, 200, { totalSeller, sellers });
    //     } catch (error) {
    //         console.error("Error fetching active sellers:", error.message);
    //         responseReturn(res, 500, { message: "Server Error" });
    //     }
    // };
    // get_deactive_sellers = async (req, res) => {
    //     let { page, searchValue, parPage } = req.query
    //     page = parseInt(page)
    //     parPage = parseInt(parPage)

    //     const skipPage = parPage * (page - 1)

    //     try {
    //         if (searchValue) {
    //             const sellers = await sellerModel.find({
    //                 $text: { $search: searchValue },
    //                 status: 'deactive'
    //             }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

    //             const totalSeller = await sellerModel.find({
    //                 $text: { $search: searchValue },
    //                 status: 'deactive'
    //             }).countDocuments()

    //             responseReturn(res, 200, { totalSeller, sellers })
    //         } else {
    //             const sellers = await sellerModel.find({ status: 'deactive' }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
    //             const totalSeller = await sellerModel.find({ status: 'deactive' }).countDocuments()
    //             responseReturn(res, 200, { totalSeller, sellers })
    //         }

    //     } catch (error) {
    //         console.log('active seller get ' + error.message)
    //     }
    // }
}

module.exports = new userController()