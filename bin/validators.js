function IsGenericNameValid(name, output = true) {
  const regex = /^[a-z0-9-]+$/; // lowercase, numbers and hyphens

  const res = regex.test(name);

  if (output && !res) {
    console.error(`Parameter is invalid: ${name}. Use lower case, numbers and hyphens only`);
  }

  return res;
}

module.exports = {IsGenericNameValid}