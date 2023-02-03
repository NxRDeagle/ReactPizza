import React from 'react';
import axios from 'axios';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';

import { SearchContext } from '../App';

const Home = () => {
  const { searchValue } = React.useContext(SearchContext);

  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState(0);
  const [activeSort, setActiveSort] = React.useState({
    name: 'популярности',
    sortProperty: 'rating',
  });
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setIsLoading(true);

    const order = activeSort.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = activeSort.sortProperty.replace('-', '');
    const category = activeCategory > 0 ? `category=${activeCategory}` : ``;
    const search = searchValue ? `search=${searchValue}` : ``;

    axios
      .get(
        `https://63d55dc1c52305feff7304ee.mockapi.io/items?page=${currentPage}&limit=4${category}&sortby=${sortBy}&order=${order}${search}`,
      )
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [activeCategory, activeSort, searchValue, currentPage]);

  const pizzas = items
    .filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
    .map((obj) => <PizzaBlock {...obj} key={obj.id} />);
  const skeletons = [...new Array(8)].map((obj, index) => <Skeleton key={index} />);

  return (
    <>
      <div className="content__top">
        <Categories
          activeCategory={activeCategory}
          onClickCategory={(index) => setActiveCategory(index)}
        />
        <Sort activeSort={activeSort} onClickSort={(sortItem) => setActiveSort(sortItem)} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination onChangePage={(page) => setCurrentPage(page)} />
    </>
  );
};

export default Home;
