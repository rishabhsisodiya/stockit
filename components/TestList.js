import gql from 'graphql-tag';
import { useQuery} from '@apollo/react-hooks';
// import {useQuery,gql} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {Avatar,Button,Stack, Thumbnail, Card, Filters, ResourceItem, ResourceList, TextField, TextStyle, Heading,Checkbox, Link, ChoiceList, Pagination, Toast} from '@shopify/polaris';
import EditQuantity from './EditQuantity';

//variants s xs m l
const GET_All_PRODUCTS = gql`
query getAllProducts($numProducts: Int!, $cursor: String){
  shop{
    url
  }
  products(first: $numProducts, after: $cursor){
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
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
        variants(first:6){
          edges{
            node{
              title
              price
              id
              inventoryQuantity
              sku
              inventoryItem {
                id
              }
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
console.log('TestProductList rendering..');
//refetch for loading new data after updating quantity
const [cursor,setCursor] = useState(null);
const [firstCursor,setFirstCursor] = useState(null);
const { loading, error, data,refetch } = useQuery(GET_All_PRODUCTS,{variables:{numProducts:50,cursor}});
const [rows, setRows]= useState([]);
const [selectedItems, setSelectedItems] = useState([]);
//Sorting..
const [sortValue, setSortValue] = useState('PRODUCT_DESC');
//Filters
const [availability, setAvailability] = useState(null);
const [productType, setProductType] = useState(null);
const [taggedWith, setTaggedWith] = useState(null);
const [queryValue, setQueryValue] = useState(null);

//Toast after updating quantity
const [active, setActive] = useState(false);
const toggleActive = useCallback(() => {
  setActive((active) => !active)
  refetch() 
}, []);

const toastMarkup = active ? (
  <Toast
    content="Inventory Updated!"
    onDismiss={toggleActive}
    duration={10000}
  />
  ) : null;

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


//useEffect for storing previous fetched data
// const prevItemsRef = useRef([]);
// useEffect(() => {
//   console.log('useEffect');
//   prevItemsRef.current= items;
// })
// const prevItems=prevItemsRef.current;

if (loading) return <div>Loading...</div>
if (error) return <div>{error.message}</div>
console.log('Before refetch',data);
if (data.products.pageInfo.hasNextPage) {
  console.log('Next Page');
  // setRows([...rows,...items]);
  setCursor(data.products.edges[49].cursor);
  refetch();  
  console.log('refetch called');
}
const items = [...allData(data)]
// console.log('items:');
// console.log(items);
// console.log('printing rows:');
// console.log(rows);
 
const resourceName = {
  singular: 'product',
  plural: 'products',
};

  return (
    <Card>
      {toastMarkup}
      <ResourceList
        resourceName={resourceName}
        items={items}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        promotedBulkActions={promotedBulkActions}
        bulkActions={bulkActions}
        sortValue={sortValue}
        sortOptions={[
          {label: 'Product A-Z', value: 'PRODUCT_ASC'},
          {label: 'Product A-Z', value: 'PRODUCT_DESC'},
          {label: 'Available (Ascending)', value: 'AVAILABLE_ASC'},
          {label: 'Available (Descending)', value: 'AVAILABLE_DESC'},
        ]}
        onSortChange={(selected) => {
          setSortValue(selected);
          console.log(`Sort option changed to ${selected}.`);
        }}
        filterControl={filterControl}
      />
      <div style={{display:"flex",justifyContent:"center"}}>
        <Pagination
          hasPrevious={data.products.pageInfo.hasPreviousPage}
          onPrevious={() => {
            console.log('Previous');
            setCursor(firstCursor);
            refetch();
          }}
          hasNext={data.products.pageInfo.hasNextPage}
          onNext={() => {
            console.log('Next');
            if (data.products.pageInfo.hasPreviousPage) {
              setFirstCursor(data.products.edges[0].cursor)
            }
            setCursor(data.products.edges[49].cursor);
            refetch();
          }}
        />
      </div> 
    </Card>
  );
  function allData(data){
    let newData=[];
    const shopUrl=data.shop.url;
    data.products.edges.map( (item) => {
      const imageSource=item.node.images.edges[0] ? item.node.images.edges[0].node.originalSrc : '';
      const imageAltText=item.node.images.edges[0] ? item.node.images.edges[0].node.altText : 'Product Image';
      const productId=item.node.id;
      const productTitle=item.node.title;
      item.node.variants.edges.map((variantItem)=>{
        const variantTitle= variantItem.node.title!=='Default Title'?variantItem.node.title:'';
        const variantId=variantItem.node.id;
        const productVariantUrl=shopUrl+'/admin/products'+productId.split("//shopify/Product")[1]+'/variants'+variantId.split("//shopify/ProductVariant")[1];
        const inventoryItemId= variantItem.node.inventoryItem.id;
        const price = variantItem.node.price;
        const sku = variantItem.node.sku;
        const inventoryQuantity = variantItem.node.inventoryQuantity;
        
        newData.push({shopUrl,imageSource,imageAltText,productTitle,productVariantUrl,variantTitle,inventoryItemId,price,sku,inventoryQuantity})
        });
    });
    // console.log('all data.');
    
    // if (data.products.pageInfo.hasNextPage) {
    //   setRows([...rows,...newData]);
    //   console.log('refetch');
    //   setCursor(data.products.edges[49].cursor);
    //   refetch();  
    // }
    return newData;
  }
  
  function renderItem(item) {
    const media = (
      <Thumbnail
        source={
          item.imageSource
        }
        alt={
          item.imageAltText
        }
      />
    );
    const style={display:"grid",gridTemplateColumns:"30% 20% 10% 40%" };
    return (
      <ResourceItem
        verticalAlignment="center"
        id={item.productId}
        media={media}
        accessibilityLabel={`View details for ${item.productTitle}`}
      >
        <div style={style}>
          <div style={{display:"grid",gridTemplateRows:"50% 50%"}}>
            <a href={item.productVariantUrl} target="_blank" style={{textDecoration:"none",color:"blue"}}>
              <div>{item.productTitle}</div>
              <div>{item.variantTitle}</div>
            </a>
          </div>
          <div>
            <p>${item.sku}</p>
          </div>
          <div> 
            <p>{item.inventoryQuantity}</p>
          </div>
          <div>
            <EditQuantity inventoryId={item.inventoryItemId} callback={toggleActive}/>
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