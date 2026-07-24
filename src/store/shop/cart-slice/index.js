import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  clearGuestCart,
  getGuestCartItems,
  setGuestCartItems,
} from "@/lib/guest-cart";

const initialState = {
  cartItems: { items: getGuestCartItems() },
  isLoading: false,
};

function buildGuestCartResponse(items) {
  return { success: true, data: { items } };
}

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, product }) => {
    if (!userId) {
      const items = getGuestCartItems();
      const existingIndex = items.findIndex(
        (item) => item.productId === productId,
      );

      if (existingIndex > -1) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({
          productId,
          title: product.title,
          image: product.image,
          price: product.price,
          salePrice: product.salePrice || 0,
          quantity,
        });
      }

      setGuestCartItems(items);
      return buildGuestCartResponse(items);
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/shop/cart/add`,
      {
        userId,
        productId,
        quantity,
      },
    );

    return response.data;
  },
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    if (!userId) {
      return buildGuestCartResponse(getGuestCartItems());
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/shop/cart/get/${userId}`,
    );

    return response.data;
  },
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    if (!userId) {
      const items = getGuestCartItems().filter(
        (item) => item.productId !== productId,
      );
      setGuestCartItems(items);
      return buildGuestCartResponse(items);
    }

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/shop/cart/${userId}/${productId}`,
    );

    return response.data;
  },
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    if (!userId) {
      let items = getGuestCartItems();

      if (quantity <= 0) {
        items = items.filter((item) => item.productId !== productId);
      } else {
        items = items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
      }

      setGuestCartItems(items);
      return buildGuestCartResponse(items);
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/shop/cart/update-cart`,
      {
        userId,
        productId,
        quantity,
      },
    );

    return response.data;
  },
);

export const mergeGuestCartOnLogin = createAsyncThunk(
  "cart/mergeGuestCartOnLogin",
  async (userId) => {
    const guestItems = getGuestCartItems();

    if (guestItems.length === 0) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/shop/cart/get/${userId}`,
      );
      return response.data;
    }

    for (const item of guestItems) {
      await axios.post(`${import.meta.env.VITE_API_URL}/shop/cart/add`, {
        userId,
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    clearGuestCart();

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/shop/cart/get/${userId}`,
    );

    return response.data;
  },
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = { items: [] };
      clearGuestCart();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(mergeGuestCartOnLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(mergeGuestCartOnLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(mergeGuestCartOnLogin.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
