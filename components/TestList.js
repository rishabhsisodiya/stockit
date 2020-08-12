import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Card, Button, ResourceList, Stack, TextStyle, Thumbnail } from '@shopify/polaris';

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
  const [selectedItems, setSelectedItems] = useState([]);

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <>
      <Card>
        <ResourceList
          resourceName={{ singular: 'Product', plural: 'Products' }}
          items={data.nodes}
          renderItem={renderItem}
          selectedItems={selectedItems}
          nSelectionChange={setSelectedItems}
          selectable
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
        <ResourceList.Item
          id={item.id}
          media={media}
          accessibilityLabel={`View details for ${item.title}`}
        >
          <Stack>
            <Stack.Item fill>
              <h3>
                <TextStyle variation='strong'>
                  {item.title}
                </TextStyle>
              </h3>
            </Stack.Item>
            <Stack.Item>
              <p>${price}</p>
            </Stack.Item>
          </Stack>
        </ResourceList.Item>
      );
  }

}

export default TestProductList;