import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();

const getDataUrl = (file) => {
    if (!file || !file.originalname || !file.buffer) {
        throw new Error("Invalid file object");
    }
    return parser.format(path.extname(file.originalname).toString(), file.buffer);
}

export default getDataUrl;