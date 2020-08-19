import {Page, Layout, Frame} from '@shopify/polaris';
import TitleTab from '../components/TitleTab';
import ProductList from '../components/ProductList';

class Index extends React.Component {

  render() {
    return (
      <Frame>
        <Page>
          <Layout>
            <Layout.Section fullWidth>
                {/* <div>Hello</div> */}
              <TitleTab/>
              {/* <ProductList/>  */}
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    );
  }
}

export default Index;