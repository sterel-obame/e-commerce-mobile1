import DataURIParser from "datauri/parser.js";
import path from "path";

// pour extraire et la sauvegarde de l'image
export const getDataUri = (file) => {
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
};
