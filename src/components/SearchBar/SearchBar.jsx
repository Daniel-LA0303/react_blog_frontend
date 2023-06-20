import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Search.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = () => {

  const route = useNavigate()
  const theme = useSelector(state => state.posts.themeW);

  const [isOpen, setIsOpen] = useState("");
  const [search, setSearch] = useState("");

  const inputRef = useRef(null);


  const handleClick = () => {
    if (!isOpen) {
      inputRef.current?.focus();
    }
    if (isOpen && search) {
      setTimeout(() => {
        setIsOpen(!(isOpen) ? "open" : "");
      }, 1000);

      setSearch('')
      route(`/search/${search}`)
    }

    setIsOpen(!(isOpen) ? "open" : "");
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleClick();
    }
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };


  return (

    <>
    <div>
      <button className="nav-button uil uil-estate"></button>
      <div className="wrapper">
        <div className={`bg-zinc-700 search ${isOpen}`}>
          <input
            ref={inputRef}
            onChange={handleChange}
            placeholder="Search"
            type="text"
            className=' bg-zinc-700 text-white'
            value={search}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={() => handleClick()}
            className={`nav-button uil uil-${isOpen ? "multiply" : "search"}`}
          >
            <FontAwesomeIcon
              icon={faSearch}
              className=' text-sm text-white'
            />
          </button>
        </div>
      </div>
    </div>
      
    </>
  )
}

export default SearchBar