import { createContext, useEffect, useState, useContext } from "react";
import productApi from "../services/product";
import skinTypeApi from "../services/skintype";
import categoryApi from "../services/category";
import productsImagesApi from "../services/productsImages";
const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsImages, setProductsImages] = useState([]);

  const fetchSkinTypes = async () => {
    try {
      const response = await skinTypeApi.getAll();
      setSkinTypes(response.data);
    } catch (error) {
      console.error("Error fetching skin type data:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const fetchProductsImages = async () => {
    try {
      const response = await productsImagesApi.getAll();
      setProductsImages(response.data);
    } catch (error) {
      console.error("Error fetching product images data:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchSkinTypes();
    fetchCategories();
    fetchProductsImages();
  }, []);

  return (
    <DataContext.Provider
      value={{ products, skinTypes, categories,productsImages, setProducts,setProductsImages,  fetchProduct }}
    >
      {children}
    </DataContext.Provider>
  );
};

const useDataContext = () => useContext(DataContext);

export { DataProvider, useDataContext };
