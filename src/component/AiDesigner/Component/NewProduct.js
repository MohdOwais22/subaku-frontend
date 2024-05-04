import React, { Fragment, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
// import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { addProductToCart } from "../../../actions/cartAction";

const NewProductByUser = ({ history }) => {
  const dispatch = useDispatch();
  // const alert = useAlert();

  const { loading } = useSelector((state) => state.newProduct);

  const [name, setName] = useState("");
  const [, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [, setCategory] = useState("");
  const [Quantity, setQuantity] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // const categories = [
  //   "Anime",
  //   "Dragon Ball",
  //   "Custom",
  //   "Tom And Jerry",
  //   "Cartoon",
  // ];

  const createProductSubmitHandler = async(e) => {
    e.preventDefault();
  
    const myForm = {
      name: name,
      price: '899',
      description: 'Custom Designed',
      category: 'custom',
      images: images,
      Quantity: Quantity
    };
  
    await dispatch(addProductToCart(myForm));
    history.push("/cart");

  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="899"
                disabled
                onChange={(e) => setPrice('899')}
              />
            </div>

            <div>
              <DescriptionIcon />

              <textarea
                placeholder="Custom Designed"
                disabled
                value={description}
                onChange={(e) => setDescription('Custom Designed')}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <AccountTreeIcon />
              <select onChange={(e) => setCategory('custom')}>
                <option value="">custom</option>
              </select>
            </div>

            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Quantity"
                required
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Create
            </Button>
          </form>
        </div>
    </Fragment>
  );
};

export default NewProductByUser;
