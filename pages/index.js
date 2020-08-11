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
            <div>
              <p>Sample app using React and Next.js</p>
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Index;