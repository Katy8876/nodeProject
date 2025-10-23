
module.exports = connectDB = async () => {
    try {
        await require("mongoose").connect(process.env.MONGO_URL);
        console.log("DB Connected!")
    } catch (error) {
        console.log(error.message)
    }
}