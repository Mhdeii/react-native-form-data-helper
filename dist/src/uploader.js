"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFormData = void 0;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const serializeFormData_1 = require("./helpers/serializeFormData");
const uploadFormData = async ({ apiInstance, endpoint, formData, onSuccess, onFailure, onOfflineSave, dispatchOfflineRequest, }) => {
    const formDataJson = (0, serializeFormData_1.serializeFormData)(formData);
    const saveOfflineRequest = async () => {
        try {
            const offlineRequests = JSON.parse((await async_storage_1.default.getItem("offlineRequests")) || "[]");
            offlineRequests.push({ endpoint, data: formDataJson });
            await async_storage_1.default.setItem("offlineRequests", JSON.stringify(offlineRequests));
            dispatchOfflineRequest === null || dispatchOfflineRequest === void 0 ? void 0 : dispatchOfflineRequest({ endpoint, data: formDataJson });
            onOfflineSave === null || onOfflineSave === void 0 ? void 0 : onOfflineSave();
        }
        catch (error) {
            console.error("Error saving request offline:", error);
        }
    };
    const attemptUpload = async (attempt) => {
        var _a;
        try {
            const response = await apiInstance.post(endpoint, formData);
            return response;
        }
        catch (error) {
            console.error(`Error during API call attempt ${attempt}:`, error);
            if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("timeout")) {
                throw new Error("timeout");
            }
            throw error;
        }
    };
    try {
        let response;
        try {
            response = await attemptUpload(1);
        }
        catch (error) {
            if (error.message === "timeout") {
                console.warn("Request timed out. Retrying...");
                response = await attemptUpload(2);
            }
            else {
                throw error;
            }
        }
        if ((response === null || response === void 0 ? void 0 : response.status) === 200) {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(response.data);
            return response.data;
        }
        else {
            console.error("Failed to upload data. Server error.");
            throw new Error("Failed to upload data.");
        }
    }
    catch (error) {
        if (error.message === "timeout") {
            console.warn("Second timeout. Saving offline.");
            await saveOfflineRequest();
        }
        else {
            console.error("Upload failed:", error);
            onFailure === null || onFailure === void 0 ? void 0 : onFailure(error);
        }
        throw error;
    }
};
exports.uploadFormData = uploadFormData;
