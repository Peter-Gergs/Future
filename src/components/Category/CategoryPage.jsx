import React, { useState, useEffect, useCallback } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";

import axiosInstance from "../../api/axiosInstance";
import API_URL from "../../config";
import Checkbox from "../../modules/CheckBox";
import i18n from "../../i18n";
import "./CategoryPage.css";

// مكون فرعي لعرض كارت المنتج لتبسيط الكود الأساسي
const ProductCard = ({ product, onAddToCart }) => {
  const discountPercentage = product.discount
    ? Math.round((product.discount / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="slider-item">
      <div className="image">
        {product.discount > 0 && (
          <span className="discount">{discountPercentage}%</span>
        )}
        <img src={product.images[0]?.image} alt={product.name} loading="lazy" />
        <span className="icon">
          <MdOutlineRemoveRedEye />
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
      <h3 className="item-title">{product.name}</h3>
      <span className="price">{product.final_price} EGP</span>
      {product.discount > 0 && (
        <span className="old-price">{product.price} EGP</span>
      )}
    </Link>
  );
};

function CategoryPage() {
  const { t } = useTranslation("product");
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // States
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // UI States (Toggles)
  const [openFilters, setOpenFilters] = useState({
    brand: false,
    category: false,
    price: false,
  });

  const page = parseInt(searchParams.get("page") || "1", 10);
  const ITEMS_PER_PAGE = 24;

  // دالة موحدة لجلب المنتجات
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/products`, {
        params: {
          category: categorySlug,
          page: page,
          brand: selectedBrands.join(","),
          min_price: minPrice,
          max_price: maxPrice,
          sub_categories: selectedCategory.join(","),
        },
        headers: { "Accept-Language": i18n.language },
      });
      console.log(data)
      setItems(data.results);
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
    } catch (err) {
      console.error(err);
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  }, [
    categorySlug,
    page,
    selectedBrands,
    selectedCategory,
    minPrice,
    maxPrice,
  ]);

  // جلب البيانات الأساسية عند تحميل الصفحة
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [brandsRes, subCatsRes] = await Promise.all([
          axios.get(`${API_URL}/api/brands/`, {
            params: { category: categorySlug },
          }),
          axios.get(`${API_URL}/api/categories/${categorySlug}/subcategories/`),
        ]);
        setBrands(brandsRes.data);
        setSubCategories(subCatsRes.data);
      } catch (err) {
        console.error("Error fetching metadata", err);
      }
    };
    fetchMetadata();
  }, [categorySlug]);

  // جلب المنتجات عند تغير الفلاتر أو الصفحة
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (product) => {
    try {
      await axiosInstance.post(`/api/cart/add/`, {
        quantity: 1,
        product_id: product.id,
      });
      toast.info("Item Added to cart Successfully");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else toast.error("Product Currently out of stock");
    }
  };

  const toggleFilter = (filterName) => {
    setOpenFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const handleBrandChange = (e) => {
    const { checked, value } = e.target;
    setSelectedBrands((prev) =>
      checked ? [...prev, value] : prev.filter((b) => b !== value),
    );
  };
  const handleCategoryChange = (e) => {
    const { checked, value } = e.target;
    setSelectedCategory((prev) =>
      checked ? [...prev, value] : prev.filter((b) => b !== value),
    );
  };

  const updatePage = (newPage) => {
    searchParams.set("page", newPage);
    setSearchParams(searchParams);
  };

  if (loading && items.length === 0) {
    return (
      <div className="loader-container">
        <SyncLoader color={"#ff4400"} size={15} />
      </div>
    );
  }

  return (
    <section className="category-section">
      <div className="container">
        <aside>
          {/* Brand Filter */}
          <div className="filter">
            <h4 onClick={() => toggleFilter("brand")}>{t("brand")}</h4>
            <div className={`check-boxs ${openFilters.brand ? "opened" : ""}`}>
              {brands.map((brand, i) => (
                <Checkbox key={i} value={brand} onChange={handleBrandChange}>
                  {brand || "NO BRAND"}
                </Checkbox>
              ))}
            </div>
            <span
              className="collapse-toggle"
              onClick={() => toggleFilter("brand")}
            >
              {openFilters.brand ? <FaMinus /> : <FaPlus />}
            </span>
          </div>

          {/* Category Filter */}
          <div className="filter">
            <h4 onClick={() => toggleFilter("category")}>{t("category")}</h4>
            <div
              className={`check-boxs ${openFilters.category ? "opened" : ""}`}
            >
              {subCategories.map((cat, i) => (
                <Checkbox
                  key={i}
                  value={cat.id}
                  onChange={handleCategoryChange}
                >
                  {cat.name_en || "NO NAME"}
                </Checkbox>
              ))}
            </div>
            <span
              className="collapse-toggle"
              onClick={() => toggleFilter("category")}
            >
              {openFilters.category ? <FaMinus /> : <FaPlus />}
            </span>
          </div>

          {/* Price Filter */}
          <div className="filter">
            <h4 onClick={() => toggleFilter("price")}>{t("price")}</h4>
            <div
              className={`price-filter check-boxs ${openFilters.price ? "opened" : ""}`}
            >
              <input
                type="number"
                placeholder={t("min")}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder={t("max")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <button type="button" onClick={fetchProducts}>
                {t("apply")}
              </button>
            </div>
            <span
              className="collapse-toggle"
              onClick={() => toggleFilter("price")}
            >
              {openFilters.price ? <FaMinus /> : <FaPlus />}
            </span>
          </div>
        </aside>

        <div className="items">
          <div className="items-container">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="page-btns">
            <button disabled={page <= 1} onClick={() => updatePage(page - 1)}>
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => updatePage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryPage;
