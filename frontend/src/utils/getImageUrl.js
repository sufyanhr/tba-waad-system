// Placeholder for image URL helper
export const getImageUrl = (name, path = '') => {
  // Return a placeholder image or generate a data URI
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
};

// Image path constants
export const ImagePath = {
  USERS: 'users',
  AVATAR: 'avatar',
  PRODUCTS: 'products'
};

export default getImageUrl;
