"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeFormData = void 0;
const serializeFormData = (formData) => {
    const jsonData = {};
    formData.forEach((value, key) => {
        if (value === null || value === void 0 ? void 0 : value.uri) {
            if (!jsonData[key]) {
                jsonData[key] = [];
            }
            jsonData[key].push({
                uri: value.uri,
                name: value.name,
                type: value.type,
            });
        }
        else {
            jsonData[key] = value;
        }
    });
    return jsonData;
};
exports.serializeFormData = serializeFormData;
