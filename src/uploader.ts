import AsyncStorage from "@react-native-async-storage/async-storage";
import { serializeFormData } from "./helpers/serializeFormData";

interface UploadOptions {
  apiInstance: any;
  endpoint: string;
  formData: FormData;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  onOfflineSave?: () => void;
  dispatchOfflineRequest?: (data: any) => void;
}

export const uploadFormData = async ({
  apiInstance,
  endpoint,
  formData,
  onSuccess,
  onFailure,
  onOfflineSave,
  dispatchOfflineRequest,
}: UploadOptions) => {
  const formDataJson = serializeFormData(formData);

  const saveOfflineRequest = async () => {
    try {
      const offlineRequests = JSON.parse(
        (await AsyncStorage.getItem("offlineRequests")) || "[]"
      );
      offlineRequests.push({ endpoint, data: formDataJson });
      await AsyncStorage.setItem(
        "offlineRequests",
        JSON.stringify(offlineRequests)
      );

      dispatchOfflineRequest?.({ endpoint, data: formDataJson });
      onOfflineSave?.();
    } catch (error) {
      console.error("Error saving request offline:", error);
    }
  };

  const attemptUpload = async (attempt: number) => {
    try {
      const response = await apiInstance.post(endpoint, formData);
      return response;
    } catch (error: any) {
      console.error(`Error during API call attempt ${attempt}:`, error);
      if (error.message?.toLowerCase().includes("timeout")) {
        throw new Error("timeout");
      }
      throw error;
    }
  };

  try {
    let response;
    try {
      response = await attemptUpload(1);
    } catch (error: any) {
      if (error.message === "timeout") {
        console.warn("Request timed out. Retrying...");
        response = await attemptUpload(2);
      } else {
        throw error;
      }
    }

    if (response?.status === 200) {
      onSuccess?.(response.data);
      return response.data;
    } else {
      console.error("Failed to upload data. Server error.");
      throw new Error("Failed to upload data.");
    }
  } catch (error: any) {
    if (error.message === "timeout") {
      console.warn("Second timeout. Saving offline.");
      await saveOfflineRequest();
    } else {
      console.error("Upload failed:", error);
      onFailure?.(error);
    }
    throw error;
  }
};
