const { ERROR_MESSAGES } = require("./constants");

const checkRequiredValues = (arrayOfRequiredValues, validationArray) => {
  const sortedRequiredArray = arrayOfRequiredValues.sort().toString();
  const sortedValidationArray = validationArray.sort().toString();

  if (sortedRequiredArray == sortedValidationArray) return;

  arrayOfRequiredValues.forEach((value) => {
    if (validationArray.findIndex((required) => required == value) == -1) {
      throw new Error(`${value} is required.`);
    }
  });
};

const checkTransformedValues = (transformedValues) => {
  const values = Object.values(transformedValues);
  let error = false;
  values.forEach((value) => {
    if (!value) {
      return (error = true);
    }
  });

  if (error)
    throw new Error(
      JSON.stringify({
        code: ERROR_MESSAGES.MALFORMATTED_FIELDS.CODE,
        message: ERROR_MESSAGES.MALFORMATTED_FIELDS.MESSAGE,
      })
    );

  return;
};

exports.ValidationUtils = {
  checkRequiredValues,
  checkTransformedValues,
};
