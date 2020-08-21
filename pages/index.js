import {Page, Layout, Frame} from '@shopify/polaris';
import TitleTab from '../components/TitleTab';
import ProductList from '../components/ProductList';

class Index extends React.Component {
// Frame for displaying toast
  render() {
    return (
      <Frame>
        <Page>
          <Layout>
            <Layout.Section fullWidth>
              <TitleTab/>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    );
  }
}

export default Index;