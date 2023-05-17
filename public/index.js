window.addEventListener('DOMContentLoaded', () => {
  console.log(ethers);
  let provider;
  let signer;
  let stakingContract;

  const STAKING_CONTRACT_ADDRESS = '0x973da004D844384f7Cf1f5C338f61f970fAA4423'; // Update to your actual contract address
  const stakingContractABI = [
    // Your ABI data
  ]

  // Connect Wallet button click event
  const connectButton = document.getElementById('connectButton');
  connectButton.addEventListener('click', async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Request user's permission to connect
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Wallet connected successfully!');

        // Initialize ethers.js and contracts after connecting the wallet
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = provider.getSigner();
        stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingContractABI, signer);

      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.error('MetaMask extension not detected!');
    }
  });

  // Stake button click event
  const stakeButton = document.getElementById('stakeButton');
  stakeButton.addEventListener('click', async () => {
    const stakeAmount = document.getElementById('stakeAmount').value;
    try {
      // Call the staking function on your contract
      const tx = await stakingContract.stake(ethers.utils.parseEther(stakeAmount));
      await tx.wait();
      console.log('Staking transaction successful!');
    } catch (error) {
      console.error('Failed to stake:', error);
    }
  });

  // Redeem button click event
  const redeemButton = document.getElementById('redeemButton');
  redeemButton.addEventListener('click', async () => {
    try {
      // Call the redeem function on your contract
      const tx = await stakingContract.getReward();
      await tx.wait();
      console.log('Redeem transaction successful!');
    } catch (error) {
      console.error('Failed to redeem:', error);
    }
  });

  // Disconnect button click event
  const disconnectButton = document.getElementById('disconnectButton');
  disconnectButton.addEventListener('click', async () => {
    // Disconnect the wallet
    try {
      await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      console.log('Wallet disconnected successfully!');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  });
});
