const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res,next);
        } catch (error) {
            res.status(500).json({ message: error.message });
            // res.status(500).json({ message: "Dont know why" });
        }
    };
};
export default TryCatch;