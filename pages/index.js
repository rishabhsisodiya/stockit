import {Page, Layout} from '@shopify/polaris';
import TitleTab from '../components/TitleTab';

class Index extends React.Component {
  state = { open: false };

  render() {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <TitleTab/>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Index;