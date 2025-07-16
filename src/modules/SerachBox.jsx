import { useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function SearchBox({ placeholder, width }) {
  const searchRef = useRef(null);
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/search/${searchRef.current.value}`);
  };
  return (
    <form
      style={{ width: `${width ? width : null}` }}
      className="search"
      onSubmit={handleSubmit}
    >
      <CiSearch onClick={handleSubmit} />
      <input ref={searchRef} type="text" placeholder={placeholder} />
    </form>
  );
}
export default SearchBox;
