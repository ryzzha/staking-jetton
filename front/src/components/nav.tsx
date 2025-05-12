import { TonConnectButton, useTonConnectUI, useTonAddress } from "@tonconnect/ui-react"
import { useEffect } from "react";

export const Nav = () => {
    const address = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    useEffect(() => {
        console.log("render nav")
        console.log("connected address -> ", address);
        console.log("tonConnectUI account chain -> ", tonConnectUI.account?.chain);
    }, [address]);
    
    return (
        <nav>
            <h3>Jetton staking</h3>
            <TonConnectButton />
          </nav>
    )
}