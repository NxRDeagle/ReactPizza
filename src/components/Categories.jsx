import React from 'react';

import '../scss/components/_categories.scss';

function Categories({ activeCategory, onClickCategory }) {
  const categories = ['Все', 'Мясные', 'Вегетарианские', 'Гриль', 'Острые', 'Закрытые'];

  return (
    <div className="categories">
      <ul>
        {categories.map((category, index) => (
          <li
            key={index}
            onClick={() => onClickCategory(index)}
            className={activeCategory === index ? 'active' : ''}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
