const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCart = async (userId: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addCartItem = async (
  userId: string,
  cartItem: { menuItem: string; quantity: number },
  token: string
) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cartItem),
    });

    if (!response.ok) {
      throw new Error("Failed to add cart item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding cart item:", error);
    throw error;
  }
};

export const updateCartItem = async (
  userId: string,
  cartItemId: string,
  quantity: number,
  token: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/users/${userId}/cart/${cartItemId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update cart item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const deleteCartItem = async (
  userId: string,
  cartItemId: string,
  token: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/users/${userId}/cart/${cartItemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete cart item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error;
  }
};
