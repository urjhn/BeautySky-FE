import { createContext, useEffect, useState, useContext } from "react";
import productAPI from "../services/product";
import skinTypeAPI from "../services/skintype";
import categoryAPI from "../services/category";
import productImagesAPI from "../services/productImages";
const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const fetchSkinTypes = async () => {
    try {
      const response = await skinTypeAPI.getAll();
      setSkinTypes(response.data);
    } catch (error) {
      console.error("Error fetching skin type data:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getAll();
      const productsData = response.data;

      // Gán hình ảnh cho từng sản phẩm
      const updatedProducts = productsData.map((product) => {
        const images = productImages.filter(
          (img) => img.productId === product.productId
        );
        return { ...product, images };
      });

      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  const fetchProductImages = async () => {
    try {
      const response = await productImagesAPI.getAll();
      setProductImages(response.data);
    } catch (error) {
      console.error("Error fetching productImages data:", error);
    }
  };

  const uploadProductImage = async (file, productId) => {
    try {
      const imageUrl = await productImagesAPI.uploadproductImages(file);
      if (imageUrl) {
        // Save uploaded image to the backend (if needed)
        await productImagesAPI.editproductImages(productId, { imageUrl });

        // Refresh product images
        await fetchProductImages();
        await fetchProduct();
      }
      return imageUrl;
    } catch (error) {
      console.error("Error uploading product image:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchProductImages(); // Fetch ảnh trước
      await fetchProduct(); // Fetch sản phẩm sau khi có ảnh
      fetchSkinTypes();
      fetchCategories();
    };
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        products,
        skinTypes,
        categories,
        productImages,
        setProducts,
        setProductImages,
        fetchProductImages,
        fetchProduct,
        uploadProductImage,
        fetchSkinTypes,
        fetchCategories,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

const useDataContext = () => useContext(DataContext);

export { DataProvider, useDataContext };
