export const serializeFormData = (formData: FormData) => {
  const jsonData: Record<string, any> = {};

  formData.forEach((value: any, key: string) => {
    if (value?.uri) {
      if (!jsonData[key]) {
        jsonData[key] = [];
      }
      jsonData[key].push({
        uri: value.uri,
        name: value.name,
        type: value.type,
      });
    } else {
      jsonData[key] = value;
    }
  });

  return jsonData;
};
