// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar.jsx';

import Home from './Home.jsx';
import Cart from './Cart.jsx';
import ProductDetail from './ProductDetail.jsx';
import Checkout from './Checkout.jsx';
import About from './About.jsx';
import Wishlist from './Wishlist.jsx';
import Admin from './Admin.jsx';

import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import Footer from './Footer.jsx';
import Search from './Search.jsx';
import Category from './Category.jsx';
import MyOrders from './MyOrders.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Catch-all for wrong URLs */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-3xl font-bold text-black">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;