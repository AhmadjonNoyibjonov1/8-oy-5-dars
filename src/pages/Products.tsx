import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  attributes: {
    title: string;
    category: string;
    company: string;
    price: number;
    image: string;
  };
}

function Products() {
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [company, setCompany] = useState<string>('');
  const [sort, setSort] = useState<string>('');
  const [price, setPrice] = useState<number>(1000);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch('https://strapi-store-server.onrender.com/api/products');
      const data = await response.json();
      setProducts(data.data);
      setFilteredProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function filterProducts() {
    let tempProducts = [...products];

    if (search) {
      tempProducts = tempProducts.filter(product =>
        product.attributes.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'all') {
      tempProducts = tempProducts.filter(product =>
        product.attributes.category === category
      );
    }

    if (company) {
      tempProducts = tempProducts.filter(product =>
        product.attributes.company === company
      );
    }

    tempProducts = tempProducts.filter(product =>
      product.attributes.price / 100 <= price
    );

    if (sort === 'az') {
      tempProducts.sort((a, b) => a.attributes.title.localeCompare(b.attributes.title));
    } else if (sort === 'za') {
      tempProducts.sort((a, b) => b.attributes.title.localeCompare(a.attributes.title));
    } else if (sort === 'low') {
      tempProducts.sort((a, b) => a.attributes.price - b.attributes.price);
    } else if (sort === 'high') {
      tempProducts.sort((a, b) => b.attributes.price - a.attributes.price);
    }

    setFilteredProducts(tempProducts);
  }

  function handleReset() {
    setSearch('');
    setCategory('all');
    setCompany('');
    setSort('');
    setPrice(1000);
    setFilteredProducts(products);
  }

  const handleClickCard = (id: number) => {
    navigate(`/details/${id}`);
  };

  return (
    <div>
      <div className="w-[1124px] h-[220px] bg-[#F0F6FF] pt-6 pl-9 rounded-lg mx-auto my-20">
        <div className="max-w-[1200px] w-full mx-auto">
          <div className="flex gap-5">
            <label className="input input-bordered input-sm flex items-center gap-2 w-[235px] mt-7">
              <input 
                type="text" 
                className="grow" 
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)} 
              />
            </label>

            <span>
              <p className="text-sm text-gray-600 font-normal mb-2">Select Category</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered select-sm w-[250px]"
              >
                <option value="all">all</option>
                <option value="Tables">Tables</option>
                <option value="Chairs">Chairs</option>
                <option value="Kids">Kids</option>
                <option value="Sofas">Sofas</option>
                <option value="Beds">Beds</option>
              </select>
            </span>

            <span>
              <p className="text-sm text-gray-600 font-normal mb-2">Select Company</p>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="select select-bordered select-sm w-[250px]"
              >
                <option value="">all</option>
                <option value="Modenza">Modenza</option>
                <option value="Luxora">Luxora</option>
                <option value="Artifex">Artifex</option>
                <option value="Comfora">Comfora</option>
                <option value="Homestead">Homestead</option>
              </select>
            </span>

            <span>
              <p className="text-sm text-gray-600 font-normal mb-2">Sort By</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="select select-bordered select-sm w-[250px]"
              >
                <option value="az">a-z</option>
                <option value="za">z-a</option>
                <option value="high">high</option>
                <option value="low">low</option>
              </select>
            </span>
          </div>
          <div className="mt-6">
            <div className="flex flex-col gap-2 p-2 rounded-lg">
              <span className='flex'>
                <p className=" text-[15px] font-normal">Select Price</p>
                <span className="ml-[120px] font-normal text-sm">${price}.00</span>
              </span>
              <input 
                onChange={(e) => setPrice(Number(e.target.value))} 
                type="range" 
                min={0} 
                max={1000} 
                value={price}
                className="range range-info w-64" 
              />
              <div className="flex text-xs text-gray-500">
                <span>0</span>
                <span className="ml-[165px]">Max : $1,000.00</span>
              </div>
            </div>
            <div className="flex items-center gap-5 relative top-[-65px] left-[345px]">
              <label className="flex items-center gap-2">
                Free Shipping
                <input type="checkbox" defaultChecked className="checkbox ml-[-60px] mb-[-50px] w-[18px] h-[18px]" />
              </label>
              <button
                onClick={filterProducts}
                className="w-[250px] ml-24 bg-[#007bff] text-gray-200 font-bold py-2 rounded-lg"
              >
                SEARCH
              </button>
              <button
                onClick={handleReset}
                className="w-[250px] bg-[#d63384] text-gray-200 font-bold py-2 rounded-lg"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto mb-32">
        <div className="flex flex-wrap ml-8 gap-10">
          {filteredProducts.map(product => (
            <div 
              onClick={() => handleClickCard(product.id)} 
              key={product.id} 
              className="card cursor-pointer p-4 w-[352px] bg-base-100 shadow-xl"
            >
              <figure>
                <img 
                  src={product.attributes.image} 
                  alt={product.attributes.title} 
                  className="w-full rounded-b-xl h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title capitalize tracking-wider justify-center">
                  {product.attributes.title}
                </h2>
                <p className='text-primary text-center'>
                  ${product.attributes.price / 100}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
