import { useState } from "react";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function Sell() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    amount: "",
    description: "",
    category: "",
  });

  const isAuth = useSelector(selectIsAuth);
  console.log(isAuth)

  const addItemToSell = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/items/sell",
        {
          formData,
          id: isAuth.value.id,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    addItemToSell(formData);
  };

  return (
    <div>
      <h1>Sell Item</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          name="name"
        />
        <input
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          name="price"
        />
        <input
          placeholder="Amount"
          value={formData.amount}
          onChange={handleInputChange}
          name="amount"
        />
        <input
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
          name="category"
        />
        <input
          placeholder="Desciption"
          value={formData.description}
          onChange={handleInputChange}
          name="description"
        />
        <button type="submit">Sell</button>
      </form>
    </div>
  );
}
