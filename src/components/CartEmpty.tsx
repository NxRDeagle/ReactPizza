import React from 'react';
import { Link } from 'react-router-dom';

import cartEmptyImg from '../assets/img/empty-cart.png';

const CartEmpty: React.FC = () => (
  <div className="cart cart--empty">
    <h2>Корзина пустая 😕</h2>
    <p>
      Вероятней всего, вы ещё не заказывали пиццу.
      <br />
      Для того, чтобы заказать пиццу, перейдите на главную страницу.
    </p>
    <img src={cartEmptyImg} alt="Empty cart" />
    <Link to="/" className="button go-back-btn">
      <span>Вернуться назад</span>
    </Link>
  </div>
);

export default CartEmpty;
