import React from 'react';
import qs from 'qs';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import { fetchPizzas } from '../redux/slices/pizzaSlice.js';
import { selectPizzaData } from '../redux/slices/pizzaSlice.js';
import { selectFilter } from '../redux/slices/filterSlice';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';

import { sortingCategories } from '../components/Sort';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  const getPizzas = async () => {
    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(fetchPizzas({ sortBy, order, category, search, currentPage }));

    window.scrollTo(0, 0);
  };

  // Если был первый рендер, то производим запрос данных
  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
  }, [sort.sortProperty, categoryId, currentPage, searchValue]);

  // Если был первый рендер, то проверяем URL-параметры и сохраняем их в Redux
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));

      const sort = sortingCategories.find((obj) => obj.sortProperty === params.sortProperty);
      dispatch(setFilters({ ...params, sort }));
      isSearch.current = true;
    }
  }, []);

  // Если был первый рендер, и мы изменили параметры
  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });

      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [sort.sortProperty, categoryId, currentPage, searchValue]);

  const pizzas = items
    .filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
    .map((obj) => (
      <Link to={`/pizza/${obj.id}`} key={obj.id}>
        <PizzaBlock {...obj} />
      </Link>
    ));
  const skeletons = [...new Array(8)].map((obj, index) => <Skeleton key={index} />);

  return (
    <>
      <div className="content__top">
        <Categories activeCategory={categoryId} onClickCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Корзина пустая 😕</h2>
          <p>
            Вероятней всего, вы ещё не заказывали пиццу.
            <br />
            Для того, чтобы заказать пиццу, перейдите на главную страницу.
          </p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </>
  );
};

export default Home;
