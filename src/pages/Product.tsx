import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Braed from "../component/BreadCrumbs";

interface Product {
  id: number;
  attributes: {
    title: string;
    company: string;
    price: number;
    description: string;
    colors: string[];
    image: string;
  };
}

function Products() {
  const { id } = useParams<{ id: string }>(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number>(1);

  useEffect(() => {
    fetch(`https://strapi-store-server.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data.data));
  }, [id]);

  const handleAddToBag = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      title: product.attributes.title,
      price: product.attributes.price,
      color: selectedColor,
      amount: selectedAmount,
      image: product.attributes.image,
    };

    let existingCart: typeof cartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingProductIndex = existingCart.findIndex(
      item => item.id === product.id && item.color === selectedColor
    );

    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].amount += selectedAmount;
    } else {
      existingCart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-8 mb-10">
      <div className="text-md breadcrumbs ml-44">
        <Braed />
      </div>
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        <img
          src={product.attributes.image}
          alt={product.attributes.title}
          className="w-96 h-96 object-cover rounded-lg lg:w-1/2 flex mx-auto"
        />
        <div className="w-1/2">
          <h2 className="capitalize text-3xl font-bold">{product.attributes.title}</h2>
          <p className="text-xl text-neutral-content font-bold mt-2">{product.attributes.company}</p>
          <p className="mt-3 text-xl">${product.attributes.price / 100}</p>
          <p className="mt-6 leading-8">{product.attributes.description}</p>
          <div className="mt-6">
            <span className="text-md font-medium tracking-wider capitalize">Colors:</span>
            <div className="mt-2">
              {product.attributes.colors.map((color, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: color }}
                  className={`badge w-6 h-6 mr-2 border-2 border-secondary cursor-pointer ${
                    selectedColor === color ? "border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedColor(color)}
                ></div>
              ))}
            </div>
          </div>
          <div className="form-control w-full max-w-xs mt-4">
            <span className="mr-4">Amount:</span>
            <select
              className="border rounded p-2"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
            >
              {[...Array(10).keys()].map(i => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-10"
            onClick={handleAddToBag}
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;
