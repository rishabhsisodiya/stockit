import gql from 'graphql-tag';
import { useQuery} from '@apollo/react-hooks';
// import {useQuery,gql} from '@apollo/client';
import React, {useCallback, useState} from 'react';
import {Avatar,Button,Stack, Thumbnail, Card, Filters, ResourceItem, ResourceList, TextField, TextStyle, Heading,Checkbox, Link, ChoiceList, Pagination, Toast, Popover, ActionList, Spinner, Loading} from '@shopify/polaris';
import EditQuantity from './EditQuantity';

const GET_All_PRODUCTS = gql`
query getAllProducts($numProducts: Int!, $cursor: String,$sort:ProductSortKeys!,$reverse:Boolean!,$query:String){
  shop{
    url
  }
  products(first: $numProducts, after: $cursor,sortKey:$sort,reverse:$reverse,query:$query){
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges{
      cursor
      node{
        title
        id
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
              id
              sku
              inventoryQuantity
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

const Sandbox = () => {

console.log('Sandbox rendering..');
//-----------GraphQl query state variable-------------START------------- 
// pagination
const [cursor,setCursor] = useState(null);
const [prevCursor,setPrevCursor] = useState([]);
// console.log(prevCursor);
//sort graphql query
const [sort, setSort] = useState('INVENTORY_TOTAL');
const [reverse, setReverse] = useState(false);
//filter
const [query, setQuery] = useState("")
//-----------GraphQl query state variable--------------END------------ 

//Sorting Resource List options
const [sortValue, setSortValue] = useState('INVENTORY_TOTAL-ASC');
const sortOptions =[
  {label: 'Available (ascending)', value: 'INVENTORY_TOTAL-ASC'},
  {label: 'Available (descending)', value: 'INVENTORY_TOTAL-DESC'},
  {label: 'Title (ascending)', value: 'TITLE-ASC'},
  {label: 'Title (descending)', value: 'TITLE-DESC'},
  {label: 'Updated (ascending)', value: 'UPDATED_AT-ASC'},
  {label: 'Updated (descending)', value: 'UPDATED_AT-DESC'},
]
//Select All options
const [selectedItems, setSelectedItems] = useState([]);
//Popover for variants list
const [selectKey, setselectKey] = useState(0);
const [selectValue, setselectValue] = useState('Select')
const selectHandler = useCallback(
  (event) => {
    setselectKey(event.target.selectedIndex)
    setselectValue(event.target.value); 
  },
  [],
)

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

//------------Filters----------------------------------
const [availability, setAvailability] = useState(null);
const [productType, setProductType] = useState(null);
const [taggedWith, setTaggedWith] = useState(null);
const [queryValue, setQueryValue] = useState(null);
const [queryTimeout, setQueryTimeout] = useState(0);
const handleAvailabilityChange = useCallback(
    (value) => {
      // console.log('query availabilty:',value)
      clearTimeout(queryTimeout);
      setAvailability(value)
      setQueryTimeout(
        setTimeout(() => {
          let qStr=query;
          value.map(val => 
            {
              qStr=qStr+' OR '+'published_status:'+val;
            })
            console.log(qStr);
          setQuery(qStr);
        }, 3000)
      );
    },
    [],
);
const handleProductTypeChange = useCallback(
    (value) => {
      // console.log('product type search:',value)
      clearTimeout(queryTimeout);
      setProductType(value);
      setQueryTimeout(
        setTimeout(() => {
          let qStr=query;
          value.map(val => 
            {
              qStr=qStr+' OR '+'product_type:'+val;
            })
            console.log(qStr);
          setQuery(qStr);
        }, 3000)
      );
    },
    [],
);
const handleTaggedWithChange = useCallback(
    (value) =>{
      console.log('tagged search:',value)
      clearTimeout(queryTimeout);
      setTaggedWith(value);
      setQueryTimeout(
        setTimeout(() => {
          let qStr=query+' OR '+'tag:'+value;
            console.log(qStr);
          setQuery(qStr);
        }, 3000)
      );
    } ,[],);

const handleFiltersQueryChange = useCallback(
  
   (value) => {
    clearTimeout(queryTimeout);
    setQueryValue(value);
    setQueryTimeout(setTimeout(() => {
      let qStr=query+' OR '+value;
      console.log(qStr);
       setQuery(qStr);
     }, 3000));
    },
    [],
);

// Filter remove methods
const handleAvailabilityRemove = useCallback(
  () => { 
    let str=query;
    let splittedOR = str.split("OR");
    let qStr= splittedOR.filter(str=> !str.includes("published_status"));
    console.log(qStr);
    setQuery(qStr);
    setAvailability(null)
  }
  , []);
const handleProductTypeRemove = useCallback(() => {
    let str=query;
    let splittedOR = str.split("OR");
    let qStr= splittedOR.filter(str=> !str.includes("product_type"));
    console.log(qStr);
    setQuery(qStr);
    setProductType(null)
  }
  , []);
const handleTaggedWithRemove = useCallback(
  () => {
    let str=query;
    let splittedOR = str.split("OR");
    let qStr= splittedOR.filter(str=> !str.includes("tag"));
    console.log(qStr);
    setQuery(qStr);
    setTaggedWith(null)
  }
  , []);
const handleQueryValueRemove = useCallback(
  () => {
    let str=query;
    let splittedOR = str.split("OR");
    let qStr= splittedOR.filter(str=> str.includes(":"));
    console.log(qStr);
    setQuery(qStr);
    setQueryValue(null)
  }
  , []);
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

  //DEfine all filters
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
            {label: 'Suit Set', value: 'Suit-Set'},
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
        <div>
          <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          labelHidden
          />
        </div>
      ),
    },
  ];

  //Check which filter is selected and then push into appliedfilters whichever is available
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

const { loading, error, data,refetch} = useQuery(GET_All_PRODUCTS,{variables:{numProducts:20,cursor,sort,reverse,query}});  
if (loading) return <div style={{justifyContent:"center"}}><Spinner accessibilityLabel="loading"/></div>
if (error) {
  if (error.message=='GraphQL error: Throttled') {
    console.log(error.message);
    setTimeout(() => {
      refetch();
    }, 7000);
    return <Spinner accessibilityLabel="Throttled Error Spinner"/>
  }
  return <div>{error.message}</div>
}
console.log(data)
const resourceName = {
  singular: 'product',
  plural: 'products',
};

  return (
    <Card>
      {toastMarkup}
      <ResourceList
        resourceName={resourceName}
        items={data.products.edges}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        // promotedBulkActions={promotedBulkActions}
        // bulkActions={bulkActions}
        sortValue={sortValue}
        sortOptions={sortOptions}
        onSortChange={(selected) => {
          let [sortingValue, orderString]=selected.split("-");
          let order = (orderString === 'DESC');
          setSortValue(selected);
          setSort(sortingValue);
          setReverse(order);
        }}
        filterControl={filterControl}
      />
      <div style={{display:"flex",justifyContent:"center"}}>
        <Pagination
          hasPrevious={data.products.pageInfo.hasPreviousPage}
          onPrevious={() => {
            // console.log('Previous');
            setCursor(prevCursor.pop());
            refetch();
          }}
          hasNext={data.products.pageInfo.hasNextPage}
          onNext={() => {
            // console.log('Next');
            let lastCursor = data.products.edges[19].cursor;

            if (data.products.pageInfo.hasPreviousPage) {
              setPrevCursor([...prevCursor,lastCursor])
            }
            setCursor(lastCursor);
            refetch();
          }}
        />
      </div> 
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
    let variantKey = selectKey;
    const shopUrl=data.shop.url;
    const productId=item.node.id.split("//shopify/Product")[1];
    const productTitle=item.node.title;
    if (item.node.variants.edges.length<=variantKey) {
      variantKey=0;
    }
    //Variants
    const variantId=item.node.variants.edges[variantKey].node.id;
    const variantTitle=item.node.variants.edges[variantKey].node.title!=='Default Title'?item.node.variants.edges[variantKey].node.title:'';
    // console.log(variantTitle);
    const selectVariantList = item.node.variants.edges.map(
      (variantItem) => {
        return variantItem.node.title!=='Default Title'?variantItem.node.title:'';
      }
    )
    const variantTitleTag = selectVariantList.length>1?(
      <div>
        <select value={selectValue} onChange={selectHandler}>
            {selectVariantList.map(
              (title,id) => {
              return (<option id={id} key={id} value={title}>{title}</option>)
              }
            )
            }     
        </select> 
      </div>
    ):variantTitle;
    const productVariantUrl=shopUrl+'/admin/products'+productId+'/variants'+variantId.split("//shopify/ProductVariant")[1];
    const inventoryItemId= item.node.variants.edges[variantKey].node.inventoryItem.id;
    // const price = item.node.variants.edges[variantKey].node.price;
    const sku = item.node.variants.edges[variantKey].node.sku;
    const inventoryQuantity = item.node.variants.edges[variantKey].node.inventoryQuantity;
    const style={display:"grid",gridTemplateColumns:"30% 20% 10% 40%" };
    return (
      <ResourceItem
        verticalAlignment="center"
        id={item.node.id}
        media={media}
        accessibilityLabel={`View details for ${item.node.title}`}
      >
        <div style={style}>
          <div style={{display:"grid",gridTemplateRows:"50% 50%"}}>
            <div>
              <a href={productVariantUrl} target="_blank" style={{textDecoration:"none",color:"blue"}}>
                {productTitle}
              </a>
            </div>
            <div>
                {variantTitleTag}
            </div>
          </div>
          <div>
            <p>{sku}</p>
          </div>
          <div> 
            <p>{inventoryQuantity}</p>
          </div>
          <div>
            <EditQuantity key={variantId} inventoryId={inventoryItemId} callback={toggleActive}/>
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

export default Sandbox;