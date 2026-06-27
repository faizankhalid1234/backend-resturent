import { SITE_FILE, DATA_DIR } from "../config.js";
import { readJsonFile, writeJsonFile, ensureDir } from "../utils/fileStore.js";

ensureDir(DATA_DIR);

const DEFAULT_CATALOG = {
  categories: [
    { id: 1, title: "APPETIZER", arabicTitle: "المقبلات", image: "/src/assets/dummy/fries.jpg" },
    { id: 2, title: "SALAD", arabicTitle: "سلطات", image: "/src/assets/dummy/salad.jpg" },
    { id: 3, title: "SOUP", arabicTitle: "شوربة", image: "/src/assets/dummy/soup.jpg" },
    { id: 4, title: "BARBEQUE", arabicTitle: "مشويات", image: "/src/assets/dummy/bbq.jpg" },
    { id: 5, title: "SEAFOOD", arabicTitle: "مأكولات بحرية", image: "/src/assets/dummy/fish.jpg" },
    { id: 6, title: "RICE", arabicTitle: "أرز", image: "/src/assets/dummy/mandi.jpg" },
    { id: 7, title: "CHICKEN", arabicTitle: "دجاج", image: "/src/assets/dummy/chicken.jpg" },
    { id: 8, title: "MUTTON", arabicTitle: "لحم", image: "/src/assets/dummy/mutton.jpg" },
  ],
  menuItems: [
    { id: "deal-1", title: "Half Daigi Steam With Rice+Drink", price: "22.00 SAR", categoryId: 1, type: "deal", image: "" },
    { id: "deal-2", title: "Full Daigi Steam With Rice+Drink", price: "40.00 SAR", categoryId: 1, type: "deal", image: "" },
    { id: "deal-3", title: "BHANDU KHAN SPECIAL PLATTER FULL", price: "75.00 SAR", categoryId: 4, type: "deal", image: "" },
    { id: "item-1", title: "Chicken Mandi", price: "35.00 SAR", categoryId: 6, type: "menu", image: "" },
    { id: "item-2", title: "Mix Grill Platter", price: "55.00 SAR", categoryId: 4, type: "menu", image: "" },
    { id: "item-3", title: "Fresh Orange Juice", price: "12.00 SAR", categoryId: 1, type: "menu", image: "" },
  ],
};

function readCatalogFile() {
  const data = readJsonFile(SITE_FILE, null);
  if (!data?.categories?.length) return { ...DEFAULT_CATALOG };
  return {
    categories: data.categories || DEFAULT_CATALOG.categories,
    menuItems: data.menuItems || DEFAULT_CATALOG.menuItems,
  };
}

export function readCatalog() {
  return readCatalogFile();
}

export function saveCatalog(catalog) {
  writeJsonFile(SITE_FILE, catalog);
  return catalog;
}

export function updateCategories(categories) {
  const catalog = readCatalogFile();
  catalog.categories = categories;
  return saveCatalog(catalog);
}

export function updateMenuItems(menuItems) {
  const catalog = readCatalogFile();
  catalog.menuItems = menuItems;
  return saveCatalog(catalog);
}
