import {Page, Layout} from '@shopify/polaris';
import TitleTab from '../components/TitleTab';
import ProductList from '../components/ProductList';

class Index extends React.Component {
  state = { open: false };

  render() {
    return (
      <Page>
        <Layout>
          <Layout.Section fullWidth>
              {/* <div>Hello</div> */}
            <TitleTab/>
            {/* <ProductList/>  */}
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Index;