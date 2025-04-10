
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectButton } from 'primereact/selectbutton';
import { ProductService } from './service/ProductService';

export default function SizeDemo() {
  const [products, setProducts] = useState([]);
  const [sizeOptions] = useState([
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' }
  ]);
  const [size, setSize] = useState(sizeOptions[1].value);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
  }, []);

  return (
    <div className="card">
      <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div>
  );
}
