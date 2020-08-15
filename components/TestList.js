import gql from 'graphql-tag';
import { useQuery} from '@apollo/react-hooks';
// import {useQuery,gql} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {Avatar,Button,Stack, Thumbnail, Card, Filters, ResourceItem, ResourceList, TextField, TextStyle, Heading,Checkbox, Link} from '@shopify/polaris';
import EditQuantity from './EditQuantity';

const GET_All_PRODUCTS = gql`
query getAllProducts{
  products(first:50){
    edges{
      cursor
      node{
        title
        handle
        id
        onlineStoreUrl
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
  const [taggedWith, setTaggedWith] = useState('VIP');
  const [queryValue, setQueryValue] = useState(null);
  //Edit Quantity Handler
  const [quantityValue, setQuantiyValue] = useState(0);
  const handleQuantiyChange = useCallback((newValue) => setQuantiyValue(newValue), []);

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleQueryValueChange = useCallback(
    (value) => setQueryValue(value),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

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

  const filters = [
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
      shortcut: true,
    },
  ];

  const appliedFilters = !isEmpty(taggedWith)
    ? [
        {
          key: 'taggedWith',
          label: disambiguateLabel('taggedWith', taggedWith),
          onRemove: handleTaggedWithRemove,
        },
      ]
    : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      // appliedFilters={appliedFilters}
      onQueryChange={handleQueryValueChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div style={{paddingLeft: '8px'}}>
        <Button onClick={() => console.log('New filter saved')}>Save</Button>
      </div>
    </Filters>
  );

if (loading) return <div>Loading...</div>
if (error) return <div>{error.message}</div>
console.log(data)

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
    const variantId=item.node.variants.edges[0].node.id;
    const productUrl=item.node.onlineStoreUrl;
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
          <Link url={productUrl}>{item.node.title}</Link>
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