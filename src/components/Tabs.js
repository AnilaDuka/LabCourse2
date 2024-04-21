const allTabs = [{ name: "Products" }, { name: "Categories" }];

const [products, categories] = allTabs;
const initialTabs = [products, categories];

function getNextTab(tabs) {
  const existing = new Set(tabs);
  return allTabs.find((tab) => !existing.has(tab));
}

module.exports = {
  allTabs,
  initialTabs,
  getNextTab,
};
