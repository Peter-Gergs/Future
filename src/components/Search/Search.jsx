import React, { useRef, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { SyncLoader } from "react-spinners";
import axiosInstance from "../../api/axiosInstance";
import API_URL from "../../config";
import { toast } from "react-toastify";
import axios from "axios";
import Checkbox from "../../modules/CheckBox";
import { FaMinus, FaPlus } from "react-icons/fa";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
function SearchPage() {
  const { t } = useTranslation("product");
  const searchKeyword = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categoriesCheckboxs = useRef(null);
  const brandsCheckboxs = useRef(null);
  const pricesFields = useRef(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();
  const categoriesEN = [
    "Speakers",
    "Monitor Arm",
    "Network",
    "Content Creation Accessories",
    "Computer Accessories",
    "Cameras",
    "Mobile Accessories",
    "Furniture",
    "P.O.S. Service",
    "Printing Paper",
  ];
  const categoriesAR= [
    "Speakers",
    "Monitor Arm",
    "Network",
    "Content Creation Accessories",
    "Computer Accessories",
    "Cameras",
    "Mobile Accessories",
    "Furniture",
    "P.O.S. Service",
    "Printing Paper",
  ];
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
      .get(`${API_URL}/api/search/${searchKeyword.keyword}`, {
        params: {
          min_price: minPrice,
          max_price: maxPrice,
          category: selectedCategories.join(","),
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
  const handleChangeCategory = (e) => {
    let { checked, value } = e.target;
    value = value.toLowerCase();
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((category) => category !== value)
    );
    axios
      .get(`${API_URL}/api/search/${searchKeyword.keyword}`, {
        params: {
          brand: selectedBrands.join(","),
          min_price: minPrice,
          max_price: maxPrice,
          category: checked
            ? [...selectedCategories, value].join(",")
            : selectedCategories.filter((b) => b !== value).join(","),
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
  const handleChangeBrand = (e) => {
    const { checked, value } = e.target;
    setSelectedBrands((prev) =>
      checked ? [...prev, value] : prev.filter((brand) => brand !== value)
    );
    axios
      .get(`${API_URL}/api/search/${searchKeyword.keyword}`, {
        params: {
          brand: checked
            ? [...selectedBrands, value].join(",")
            : selectedBrands.filter((b) => b !== value).join(","),
          min_price: minPrice,
          max_price: maxPrice,
          category: selectedCategories.join(","),
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
  useEffect(() => {
    axios
      .get(
        `${API_URL}/api/search/${encodeURIComponent(searchKeyword.keyword)}`,
        {
          headers: {
            "Accept-Language": i18n.language, // "ar" أو "en"
          },
        }
      )
      .then((res) => {
        setItems(res.data.results);
        setLoading(false);
      });
    axios
      .get(
        `${API_URL}/api/brands/?search=${encodeURIComponent(
          searchKeyword.keyword
        )}`,
        {
          headers: {
            "Accept-Language": i18n.language, // "ar" أو "en"
          },
        }
      )
      .then((res) => {
        setBrands(res.data);
      });
  }, [searchKeyword]);
  if (loading) {
    return (
      <>
        <section style={{ textAlign: "center", padding: "2rem" }}>
          <SyncLoader color={"#ff4400"} size={15} />
        </section>
      </>
    );
  }
  return (
    <section className="category-section">
      <div className="container">
        <aside>
          <div className="filter">
            <h4>Category</h4>
            <div ref={categoriesCheckboxs} className="check-boxs">
              {(i18n.language === "ar" ?categoriesAR:categoriesEN).map((category) => (
                <Checkbox onChange={handleChangeCategory}>{category}</Checkbox>
              ))}
            </div>
            <span
              className="collapse-toggle"
              onClick={() => {
                categoriesCheckboxs.current.classList.toggle("opened");
                setIsCategoryOpen((prev) => !prev);
              }}
            >
              {isCategoryOpen ? (
                <FaMinus className="icon" />
              ) : (
                <FaPlus className="icon" />
              )}
            </span>
          </div>
          <div className="filter">
            <h4>Brand</h4>
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
            <h4>Price</h4>
            <div className="price-filter check-boxs" ref={pricesFields}>
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <button type="button" onClick={handleFilterByPrice}>
                Apply
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
        <div className="items-container">
          {items.map((product, i) => (
            <Link key={i} to={`/product/${product.slug}`}>
              <div className="slider-item">
                <div className="image">
                  {product.discount ? (
                    <span className="discount">
                      {product.discount
                        ? `${Math.round(
                            ((product.discount / product.price) * 100).toFixed(
                              1
                            )
                          )}%`
                        : ""}
                    </span>
                  ) : (
                    ""
                  )}
                  <img src={`${product.images[0].image}`} />
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
      </div>
    </section>
  );
}

export default SearchPage;
