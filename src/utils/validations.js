const checkRequiredValues = (arrayOfRequiredValues, validationArray) => {
  const sortedRequiredArray = arrayOfRequiredValues.sort().toString();
  const sortedValidationArray = validationArray.sort().toString();

  if (sortedRequiredArray == sortedValidationArray) return;

  arrayOfRequiredValues.forEach((value) => {
    if (validationArray.findIndex((required) => required == value) == -1) {
      throw new Error(`${value} is required.`);
    }
  });

  if (error.size > 0) {
  }
};

exports.ValidationUtils = {
  checkRequiredValues,
};
