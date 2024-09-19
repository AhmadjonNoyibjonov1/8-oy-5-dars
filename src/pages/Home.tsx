import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../App';
import axios from 'axios';

interface Product {
  id: number;
  attributes: {
    title: string;
    company: string;
    price: number;
    image: string;
  };
}

const Home: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://strapi-store-server.onrender.com/api/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className={`home-container ${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-black'}`}>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Welcome to Our Store</h1>
          <button
            onClick={toggleTheme}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Toggle Theme
          </button>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg p-4">
              <img
                src={product.attributes.image}
                alt={product.attributes.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-lg font-semibold mt-2">{product.attributes.title}</h2>
              <p className="text-gray-500">{product.attributes.company}</p>
              <p className="text-xl font-bold mt-2">${(product.attributes.price / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
