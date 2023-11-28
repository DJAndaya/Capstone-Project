import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const getStripePublicKey = async () => {
  try {
    const response = await axios.get('"http://localhost:3000/items/stripeKey');
    return response.data.publicKey;
  } catch (error) {
    console.log(error);
  }
};

const initializeStripe = async () => {
  const stripePublicKey = await getStripePublicKey();

  if (stripePublicKey) {
    const stripe = await loadStripe(stripePublicKey);
    // Use the 'stripe' object in the rest of your frontend code...
    return stripe;
  }

  return null;
};

export default initializeStripe;