# react-native-formdata-helper

A simple, reusable helper library for handling FormData requests in React Native.

✅ Supports file uploads, list uploads, retries, and offline saving.

---

## 📦 Features

- ✅ Serialize FormData to JSON for offline handling.
- ✅ Upload files, lists, and JSON via FormData.
- ✅ Retry API calls on timeout.
- ✅ Save failed requests offline for automatic retry.
- ✅ Works with Axios API instances.
- ✅ TypeScript support.

---

## 📥 Installation

````bash
npm install react-native-formdata-helper


## 🚀 Usage Example

Import and use the `uploadFormData` function like this:

```typescript
import { uploadFormData } from 'react-native-formdata-helper';
import Api from '@/utils/api'; // Your Axios instance
import { addOfflineRequest } from '@/store/actions/offline';
import { store } from '@/store';

const sendForm = async (formData: FormData) => {
  await uploadFormData({
    apiInstance: Api,
    endpoint: 'upload-mobile-bulk',
    formData,
    onSuccess: (data) => console.log('Upload success:', data),
    onFailure: (error) => console.error('Upload failed:', error),
    onOfflineSave: () => console.log('Saved offline for retry'),
    dispatchOfflineRequest: (data) => store.dispatch(addOfflineRequest(data)),
  });
};


## 🛠️ Preparing FormData Example

You can prepare your FormData with JSON and images like this:

```typescript
const prepareFormData = (data, photos) => {
  const formData = new FormData();
  formData.append('json', JSON.stringify(data));

  photos.forEach((photo, index) => {
    formData.append('images', {
      uri: photo.uri,
      name: photo.name || `image_${index + 1}.jpg`,
      type: photo.type || 'image/jpeg',
    });
  });

  return formData;
};
````
