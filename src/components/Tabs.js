const allTabs = [{ name: "Products" }, { name: "Categories" }, { name: "Users" }, { name: "Suppliers" }];

const [products, categories, users, suppliers] = allTabs;
const initialTabs = [products, categories, users, suppliers];

function getNextTab(tabs) {
  const existing = new Set(tabs);
  return allTabs.find((tab) => !existing.has(tab));
}

module.exports = {
  allTabs,
  initialTabs,
  getNextTab,
};
