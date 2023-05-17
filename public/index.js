window.addEventListener('DOMContentLoaded', () => {
  // Connect Wallet button click event
  const connectButton = document.getElementById('connectButton');
  let isConnected = false;

  connectButton.addEventListener('click', async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      if (!isConnected) {
        try {
          // Request user's permission to connect
          await window.ethereum.enable();
          console.log('Wallet connected successfully!');
          isConnected = true;
          connectButton.innerText = 'Disconnect Wallet';
          // You can perform further actions with the connected wallet here
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      } else {
        try {
          // Disconnect wallet
          // As of my knowledge cutoff in September 2021, there's no built-in method to disconnect a MetaMask wallet
          // A workaround is to reload the page or to clear the currently connected account
          window.location.reload();
          // or
          // window.ethereum.selectedAddress = null;
        } catch (error) {
          console.error('Failed to disconnect wallet:', error);
        }
      }
    } else {
      console.error('MetaMask extension not detected!');
    }
  });
});
