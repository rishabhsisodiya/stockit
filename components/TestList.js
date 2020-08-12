import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
// import {useQuery,gql} from '@apollo/client';
import React, { useState,useCallback} from 'react';
import {Avatar, Button,Stack, Thumbnail, Card, Filters, ResourceItem, ResourceList, TextField, TextStyle} from '@shopify/polaris';

const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

function TestProductList() {
  
  const { loading, error, data } = useQuery(GET_PRODUCTS_BY_ID, { variables: { ids: ["gid://shopify/Product/4876009144455","gid://shopify/Product/4876009603207","gid://shopify/Product/4876010684551"] } })
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  //CheckBox selectable
  // const [selectedItems, setSelectedItems] = useState([]);
  // Handle Quantityy field
  // const [value, setValue] = useState('1');

  // const handleChange = useCallback((newValue) => setValue(newValue), []);


  return (
    <>
      <Card>
        <ResourceList
          resourceName={{ singular: 'Product', plural: 'Products' }}
          items={data.nodes}
          renderItem={renderItem}
        />
      </Card>
    </>
  )

  function renderItem(item) {
      const media = (
        <Thumbnail
          source={
            item.images.edges[0] ? item.images.edges[0].node.originalSrc : ''
          }
          alt={
            item.images.edges[0] ? item.images.edges[0].altText : ''
          }
        />
      );
      const price = item.variants.edges[0].node.price;
      return (
        <ResourceItem
          id={item.id}
          media={media}
          accessibilityLabel={`View details for ${item.title}`}
        >
          <Stack>
            <Stack.Item>
              <h3>
                <TextStyle variation='strong'>
                  {item.title}
                </TextStyle>
              </h3>
            </Stack.Item>
            <Stack.Item>
              <p>${price}</p>
            </Stack.Item>
            <Stack.Item>
              <p>5</p>
            </Stack.Item>
            <Stack.Item>
              <TextField
                type="number"
                value="5"
                // value={value}
                // onChange={handleChange}
              />
              <Button>Save</Button>
            </Stack.Item>
          </Stack>
        </ResourceItem>
      );
  }

}

export default TestProductList;