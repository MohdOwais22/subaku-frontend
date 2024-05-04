import React, { Fragment, useEffect } from "react";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="ECOMMERCE" />

          <div className="banner">
            <p>Welcome to Subaku</p>
            <h1>FIND AMAZING WEARABLE PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll 
                {/* <CgMouse /> */}
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Generate Your Own Design</h2>
          <Link to='/aiMade' style={{
                display:'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}>
              <Button variant="contained" color="secondary" className="text-center">create your own design</Button>
          </Link>
          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
