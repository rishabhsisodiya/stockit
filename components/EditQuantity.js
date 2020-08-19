import gql from 'graphql-tag';
import { useQuery,useMutation} from '@apollo/react-hooks';
import { TextField, Button } from "@shopify/polaris";
import React, {useCallback, useState} from 'react';

const GET_INVENTORY_LEVELS_BY_ID = gql`
query getInventoryItemByID($id: ID!) {
    inventoryItem(id: $id) {
      id
      inventoryLevels (first:1) {
        edges {
          node {
            id
            available
          }
        }
      }
    }
  }
`;

const UPDATE_QUANTITY = gql`
mutation adjustInventoryLevelQuantity($inventoryAdjustQuantityInput: InventoryAdjustQuantityInput!) {
  inventoryAdjustQuantity(input: $inventoryAdjustQuantityInput) {
    inventoryLevel {
      available
    }
    userErrors {
      field
      message
    }
  }
}
`;

const EditQuantity = (props) => {
    // const { loading, error, data } = useQuery(GET_INVENTORY_ITEM_BY_ID,{ variables: { id: props.variantId } });
    const { loading, error, data } = useQuery(GET_INVENTORY_LEVELS_BY_ID,{ variables: { id: props.inventoryId } });
    const [ addQuantity, {mloading,merror,mdata} ] = useMutation(UPDATE_QUANTITY);
    // const id=data.productVariant.inventoryItem.id;
    // console.log(mdata);
    const [value, setvalue] = useState('');
    const handleChange = useCallback(
        (newValue) => {
            setvalue(newValue);
        },
        [],
    )
    const updateHandler = (value,data) => {
      console.log('updatehandler',data.inventoryItem.inventoryLevels.edges[0].node.id);
      addQuantity({ variables: { 
      inventoryAdjustQuantityInput: {
        inventoryLevelId:data.inventoryItem.inventoryLevels.edges[0].node.id,
        availableDelta:value
      } 
    } })
  };
// //       //{
// //   "inventoryAdjustQuantityInput" : {
// //     "inventoryLevelId": "gid://shopify/InventoryLevel/6485147690?inventory_item_id=12250274365496",
// //     "availableDelta": 1
// //   }
// // }
//       console.log(value);
//       const inventoryLevelId = data.inventoryItem.inventoryLevels.edges[0].node.id;
//       console.log(inventoryLevelId);
     
//       console.log(data);
//     }
    if (mloading) return <div>Loading...</div>
    if (merror) return <div>{merror.message}</div>
  // if (mdata) return <div>{mdata}</div>
    return (
        <div style={{display:"flex"}}>
            {/* {getInventoryLevel(data)} */}
            {/* {data.productVariant.inventoryItem.id} */}
            <TextField
              type="number"
              value={value}
              onChange={handleChange}
              placeholder="Add to available quantity"
              
            />
            <Button onClick={updateHandler}>Add</Button>
        </div>
    );

}

export default EditQuantity;