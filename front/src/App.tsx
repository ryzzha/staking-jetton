 
import './App.css'
import {THEME, TonConnect, TonConnectUIProvider,} from "@tonconnect/ui-react";
import { Nav } from './components/nav';
import { StakeJetton } from './components/stake-jetton';

const connector = new TonConnect({ manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json', walletsListSource: 'https://raw.githubusercontent.com/ton-blockchain/wallets-list/tonkeeper-deeplink/wallets-v2.json' });

function App() {

  return (
    <TonConnectUIProvider
          connector={connector}
          uiPreferences={{ theme: THEME.DARK }}
      >
        <div className='main-div'>
          <Nav />
          <StakeJetton />
        </div>
      </TonConnectUIProvider>
  )
}

export default App
