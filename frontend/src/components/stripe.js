import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const getStripePublicKey = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/items/stripeKey`);
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