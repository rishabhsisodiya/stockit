import gql from 'graphql-tag';
import { useQuery} from '@apollo/react-hooks';
// import {useQuery,gql} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {Avatar,Button,Stack, Thumbnail, Card, Filters, ResourceItem, ResourceList, TextField, TextStyle, Heading,Checkbox, Link, ChoiceList} from '@shopify/polaris';
import EditQuantity from './EditQuantity';

//variants s xs m l
const GET_All_PRODUCTS = gql`
query getAllProducts{
  shop{
    url
  }
  products(first:50){
    edges{
      cursor
      node{
        title
        handle
        id
        onlineStoreUrl
        onlineStorePreviewUrl
        images(first:1){
          edges{
            node{
              originalSrc
              altText
            }
          }
        }
        variants(first:1){
          edges{
            node{
              price
              id
              inventoryQuantity
              sku
            }
          }         
        }
      }
    }
  } 
}
`;

const TestProductList = () => {

// const { newloading, newerror, newdata } = useQuery(GET_ALL_PRODUCTS);
// console.log('All products:',newdata)
const { loading, error, data } = useQuery(GET_All_PRODUCTS);
const [selectedItems, setSelectedItems] = useState([]);
const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
const [availability, setAvailability] = useState(null);
const [productType, setProductType] = useState(null);
const [taggedWith, setTaggedWith] = useState(null);
const [queryValue, setQueryValue] = useState(null);

const handleAvailabilityChange = useCallback(
    (value) => setAvailability(value),
    [],
);
const handleProductTypeChange = useCallback(
    (value) => setProductType(value),
    [],
);
const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
);
const handleFiltersQueryChange = useCallback(
   (value) => setQueryValue(value),
    [],
);
const handleAvailabilityRemove = useCallback(() => setAvailability(null), []);
const handleProductTypeRemove = useCallback(() => setProductType(null), []);
const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
const handleFiltersClearAll = useCallback(() => {
    handleAvailabilityRemove();
    handleProductTypeRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAvailabilityRemove,
    handleQueryValueRemove,
    handleProductTypeRemove,
    handleTaggedWithRemove,
  ]);

  // const items = [
  //   {
  //     id: 341,
  //     url: 'customers/341',
  //     name: 'Mae Jemison',
  //     location: 'Decatur, USA',
  //     latestOrderUrl: 'orders/1456',
  //   },
  //   {
  //     id: 256,
  //     url: 'customers/256',
  //     name: 'Ellen Ochoa',
  //     location: 'Los Angeles, USA',
  //     latestOrderUrl: 'orders/1457',
  //   },
  // ];
  const filters = [
    {
      key: 'availability',
      label: 'Availability',
      filter: (
        <ChoiceList
          title="Availability"
          titleHidden
          choices={[
            {label: 'Online Store', value: 'Online Store'},
            {label: 'Point of Sale', value: 'Point of Sale'},
            {label: 'Buy Button', value: 'Buy Button'},
          ]}
          selected={availability || []}
          onChange={handleAvailabilityChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'productType',
      label: 'Product type',
      filter: (
        <ChoiceList
          title="Product type"
          titleHidden
          choices={[
            {label: 'T-Shirt', value: 'T-Shirt'},
            {label: 'Accessory', value: 'Accessory'},
            {label: 'Gift card', value: 'Gift card'},
          ]}
          selected={productType || []}
          onChange={handleProductTypeChange}
          allowMultiple
        />
      ),
    },
    {
      key: 'taggedWith',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          labelHidden
        />
      ),
    },
  ];

  const appliedFilters = [];
  if (!isEmpty(availability)) {
    const key = 'availability';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, availability),
      onRemove: handleAvailabilityRemove,
    });
  }
  if (!isEmpty(productType)) {
    const key = 'productType';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, productType),
      onRemove: handleProductTypeRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = 'taggedWith';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleFiltersQueryChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleFiltersClearAll}
    />
  );

  const promotedBulkActions = [
    {
      content: 'Edit customers',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  const bulkActions = [
    {
      content: 'Add tags',
      onAction: () => console.log('Todo: implement bulk add tags'),
    },
    {
      content: 'Remove tags',
      onAction: () => console.log('Todo: implement bulk remove tags'),
    },
    {
      content: 'Delete customers',
      onAction: () => console.log('Todo: implement bulk delete'),
    },
  ];

if (loading) return <div>Loading...</div>
if (error) return <div>{error.message}</div>
console.log(data)
const resourceName = {
  singular: 'product',
  plural: 'products',
};

  return (
    <Card>
      <ResourceList
        resourceName={resourceName}
        items={data.products.edges}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        promotedBulkActions={promotedBulkActions}
        bulkActions={bulkActions}
        sortValue={sortValue}
        sortOptions={[
          {label: 'Newest update', value: 'DATE_MODIFIED_DESC'},
          {label: 'Oldest update', value: 'DATE_MODIFIED_ASC'},
        ]}
        onSortChange={(selected) => {
          setSortValue(selected);
          console.log(`Sort option changed to ${selected}.`);
        }}
        filterControl={filterControl}
      />
    </Card>
  );

  function renderItem(item) {
    const media = (
      <Thumbnail
        source={
          item.node.images.edges[0] ? item.node.images.edges[0].node.originalSrc : ''
        }
        alt={
          item.node.images.edges[0] ? item.node.images.edges[0].altText : ''
        }
      />
    );
    //products/4876015698055/variants/34518453813383
    const productId=item.node.id.split("//shopify/Product")[1];
    const variantId=item.node.variants.edges[0].node.id.split("//shopify/ProductVariant")[1];
    const shopUrl=data.shop.url;
    console.log(shopUrl+''+productId+''+variantId);
    const productVariantUrl=shopUrl+'products'+productId+'variants'+variantId;
    
    const productPreviewUrl=item.node.onlineStorePreviewUrl;
    const price = item.node.variants.edges[0].node.price;
    const sku = item.node.variants.edges[0].node.sku;
    const inventoryQuantity = item.node.variants.edges[0].node.inventoryQuantity;
    const style={width:"20%"};
    return (
      <ResourceItem
        verticalAlignment="center"
        id={item.node.id}
        media={media}
        accessibilityLabel={`View details for ${item.node.title}`}
      >
        {/* thumbnail done , product title with product link, SKU , quantity  */}
        <div style={{display:"flex"}}>
          <div style={{width:"30%"}}>
          <a href={productVariantUrl} target="_blank">{item.node.title}</a>
          </div>
          <div style={{width:"20%"}}>
            <p>${sku}</p>
          </div>
          <div style={{width:"10%"}}>
            <p>{inventoryQuantity}</p>
          </div>
          <div style={{width:"40%"}}>
            <EditQuantity quantity={inventoryQuantity}/>
          </div>
        </div>
      </ResourceItem>  
    );
  }

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith':
        return `Tagged with ${value}`;
      case 'availability':
        return value.map((val) => `Available on ${val}`).join(', ');
      case 'productType':
        return value.join(', ');
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }

}

export default TestProductList;