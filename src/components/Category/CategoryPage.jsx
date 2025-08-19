import React, { useRef, useState } from "react";
import "./CategoryPage.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect } from "react";
import { SyncLoader } from "react-spinners";
import axiosInstance from "../../api/axiosInstance";
import API_URL from "../../config";
import { toast } from "react-toastify";
import axios from "axios";
import Checkbox from "../../modules/CheckBox";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
function CategoryPage() {
  const { t } = useTranslation("product");
  const categoryName = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const navigate = useNavigate();
  const brandsCheckboxs = useRef(null);
  const pricesFields = useRef(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const handleAddToCart = (product) => {
    axiosInstance
      .post(`/api/cart/add/`, {
        quantity: 1,
        product_id: product.id,
      })
      .then(() => {
        toast.info("Item Added to cart Successfully");
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          toast.error("Product Currently out of stock");
        }
      });
  };
  const handleFilterByPrice = () => {
    axios
      .get(`${API_URL}/api/products`, {
        params: {
          category: categoryName.categorySlug,
          min_price: minPrice,
          max_price: maxPrice,
          brand: selectedBrands.join(","),
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      })
      .then((res) => {
        setItems(res.data.results);
      });
  };
  const handleChangeBrand = (e) => {
    const { checked, value } = e.target;
    setSelectedBrands((prev) =>
      checked ? [...prev, value] : prev.filter((brand) => brand !== value)
    );
    axios
      .get(`${API_URL}/api/products`, {
        params: {
          category: categoryName.categorySlug,
          brand: checked
            ? [...selectedBrands, value].join(",")
            : selectedBrands.filter((b) => b !== value).join(","),
          min_price: minPrice,
          max_price: maxPrice,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      })
      .then((res) => {
        setItems(res.data.results);
        setLoading(false);
      });
  };
  const goToPage = (newPage) => {
    searchParams.set("page", newPage);
    setSearchParams(searchParams);
  };
  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`, {
        params: {
          category: categoryName.categorySlug,
          page: page,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      })
      .then((res) => {
        console.log(res);
        const count = res.data.count;
        setTotalPages(Math.ceil(count / 24));
        setItems(res.data.results);
        setLoading(false);
      });
    axios
      .get(`${API_URL}/api/brands/`, {
        params: {
          category: categoryName.categorySlug,
        },
      })
      .then((res) => {
        setBrands(res.data);
      });
  }, [categoryName.categorySlug, page]);
  if (loading) {
    return (
      <>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <SyncLoader color={"#ff4400"} size={15} />
        </div>
      </>
    );
  }
  return (
    <section className="category-section">
      <div className="container">
        <aside>
          <div className="filter">
            <h4>{t("brand")}</h4>
            <div ref={brandsCheckboxs} className="check-boxs">
              {brands.map((brand, i) => (
                <Checkbox key={i} onChange={handleChangeBrand}>
                  {brand || "NO BRAND"}
                </Checkbox>
              ))}
            </div>
            <span
              className="collapse-toggle"
              onClick={() => {
                brandsCheckboxs.current.classList.toggle("opened");
                setIsBrandOpen((prev) => !prev);
              }}
            >
              {isBrandOpen ? (
                <FaMinus className="icon" />
              ) : (
                <FaPlus className="icon" />
              )}
            </span>
          </div>
          <div className="filter">
            <h4>{t("price")}</h4>
            <div className="price-filter check-boxs" ref={pricesFields}>
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
              <button type="button" onClick={handleFilterByPrice}>
                {t("apply")}
              </button>
              <span
                className="collapse-toggle"
                onClick={() => {
                  pricesFields.current.classList.toggle("opened");
                  setIsPriceOpen((prev) => !prev);
                }}
              >
                {isPriceOpen ? (
                  <FaMinus className="icon" />
                ) : (
                  <FaPlus className="icon" />
                )}
              </span>
            </div>
          </div>
        </aside>
        <div className="items">
          <div className="items-container">
            {items.map((product, i) => (
              <Link key={i} to={`/product/${product.slug}`}>
                <div className="slider-item">
                  <div className="image">
                    {product.discount ? (
                      <span className="discount">
                        {product.discount
                          ? `${Math.round(
                              (
                                (product.discount / product.price) *
                                100
                              ).toFixed(1)
                            )}%`
                          : ""}
                      </span>
                    ) : (
                      ""
                    )}
                    <img src={`${product.images[0].image}`} loading="lazy" />
                    <span className="icon">
                      <MdOutlineRemoveRedEye />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                  <h3 className="item-title">{product.name}</h3>
                  <span className="price">{product.final_price}EGP</span>
                  {product.discount ? (
                    <span className="old-price">{product.price}EGP</span>
                  ) : (
                    ""
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="page-btns">
            <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
              Prev
            </button>
            <span>Page {page}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
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
