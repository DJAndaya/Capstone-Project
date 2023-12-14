import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const getStripePublicKey = async () => {
  try {
    const response = await axios.get('http://localhost:3000/items/stripeKey');
    return response.data.publicKey;
  } catch (error) {
    // console.log(error);
  }
};

const initializeStripe = async () => {
  const stripePublicKey = await getStripePublicKey();
  if (stripePublicKey) {
    return loadStripe(stripePublicKey)
  }
  return null;
};

export default initializeStripe;