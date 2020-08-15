import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
// import {useQuery,gql} from '@apollo/client';
import React, { useState,useCallback} from 'react';
import {Avatar,Button,Stack, Thumbnail, Card, Filters, ResourceItem, ResourceList, TextField, TextStyle, Heading,Checkbox} from '@shopify/polaris';

const GET_All_PRODUCTS = gql`
query getAllProducts{
  products(first:50){
    edges{
      cursor
      node{
        title
        handle
        id
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

function TestProductList() {
  
  const { loading, error, data } = useQuery(GET_All_PRODUCTS);
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [checked, setChecked] = useState(false);
  const handleChange = useCallback((newChecked) => {
    
    setChecked(newChecked);
    // let ids=newChecked? items.map(item=>item.id) : [];
    // setSelectedItems(ids);
  }, []);
  //CheckBox selectable
  // const [selectedItems, setSelectedItems] = useState([]);
  // Handle Quantityy field
  // const [value, setValue] = useState('1');
  // const handleChange = useCallback((newValue) => setValue(newValue), []);
  if (loading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  console.log("TestList:",data)

  return (
    <div style={{display:"flex"}}>
      {/* <Card> */}
      <Heading>
        <ResourceItem>
          <Stack>
            <Stack.Item>
              <Checkbox checked={checked} onChange={handleChange} />
            </Stack.Item>
            <Stack.Item>Title</Stack.Item>
            <Stack.Item>Availabilty</Stack.Item>
            <Stack.Item>Price</Stack.Item>
            <Stack.Item>Edit Availabilty</Stack.Item>
          </Stack>
        </ResourceItem>
      </Heading>
      <ResourceList
        resourceName={{ singular: 'Product', plural: 'Products' }}
        items={data.products.edges}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        showHeader={false}
      />
      {/* </Card> */}
    </div>
  )

  function renderItem(item) {
    // const media = (
    //   <Thumbnail
    //     source={
    //       item.node.images.edges[0] ? item.node.images.edges[0].node.originalSrc : ''
    //     }
    //     alt={
    //       item.node.images.edges[0] ? item.node.images.edges[0].altText : ''
    //     }
    //   />
    // );
    const itemId=item.node.id;
    console.log(itemId);
    const media = <Avatar customer size="medium" name={itemId} />;

    const price = item.node.variants.edges[0].node.price;
    console.log(price);
    const sku = item.node.variants.edges[0].node.sku;
    console.log(sku);
    const inventoryQuantity = item.node.variants.edges[0].node.inventoryQuantity;
    console.log(inventoryQuantity);
    
    return (
      <ResourceItem
        verticalAlignment="center"
        id={itemId}
        media={media}
        accessibilityLabel={`View details for ${item.node.title}`}
      >
        <Stack>
          <Stack.Item>
            <h3>
              <TextStyle variation='strong'>
                {item.node.title}
              </TextStyle>
            </h3>
          </Stack.Item>
          <Stack.Item>
            <p>${price}</p>
          </Stack.Item>
          <Stack.Item>
            <p>{inventoryQuantity}</p>
          </Stack.Item>
          <Stack.Item>
            <TextField
              type="number"
              value="5"
              // value={value}
              // onChange={handleChange}
            />
          </Stack.Item>
          <Stack.Item>
            <Button>Save</Button>
          </Stack.Item>
        </Stack>
      </ResourceItem>  
    );
  }
}

export default TestProductList;