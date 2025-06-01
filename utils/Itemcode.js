const generateItemCode = (category, count) => {
  const prefix = category.replace(/\s+/g, "-");
  const number = String(count + 1).padStart(3, "0");
  return `${prefix}-${number}`;
}

export { generateItemCode };
