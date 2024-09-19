import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

interface Breadcrumb {
  name: string;
  url: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    const pathArray = location.pathname.split('/').filter((i) => i);
    const currentBreadcrumbs = pathArray.map((path, index) => {
      const url = `/${pathArray.slice(0, index + 1).join('/')}`;
      return { name: path, url };
    });

    setBreadcrumbs(currentBreadcrumbs);
  }, [location]);

  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index}>
            <Link to={breadcrumb.url}>{breadcrumb.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
