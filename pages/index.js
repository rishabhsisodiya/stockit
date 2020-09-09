import {Page, Layout, Frame} from '@shopify/polaris';
import TitleTab from '../components/TitleTab';

class Index extends React.Component {
// Frame used for displaying toast
  render() {
    console.log('index rendering');
    return (
      <Frame>
        <Page>
          <Layout>
            <Layout.Section>
              <TitleTab/>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    );
  }
}

export default Index;