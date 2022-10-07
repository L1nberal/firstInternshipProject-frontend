import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import classnames from 'classnames/bind'

import style from './Search.module.scss'

const cx = classnames.bind(style)

function Search() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState(null);
    const [category, setCategory] = useState(null);
  
    useEffect(() => {
      getUsers(userList);
    }, []);
  
    //Simulating making api call with useEffect
    const getUsers = userList => {
      setUsers(userList);
    };
  
    const byCategory = (user, category) => {
      if (category) {
        return user.category === category;
      } else return user;
    };
    const bySearch = (user, search) => {
      if (search) {
        return user.name.toLowerCase().includes(search.toLowerCase());
      } else return user;
    };
  
    const filteredList = (users, category, search) => {
      return users
        .filter(user => byCategory(user, category))
        .filter(user => bySearch(user, search));
    };
  
    return (
      <div className="wrapper">
        <input
          type="search"
          placeholder="search..."
          onChange={e => setSearch(e.target.value)}
        />
        <select onChange={e => setCategory(e.target.value)}>
          <option value="">Choose Category</option>
          <option value="movies">Movies</option>
          <option value="games">Games</option>
          <option value="shows">Shows</option>
          <option value="other">Other</option>{" "}
        </select>
        {filteredList(users, category, search).map(user => (
          <div key={user.id}>
            {user.name} : {user.category}
          </div>
        ))}
      </div>
    );
  }
  
export default Search
