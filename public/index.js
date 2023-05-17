window.addEventListener('DOMContentLoaded', () => {
  console.log(ethers);
  let provider;
  let signer;
  let stakingContract;

  const STAKING_CONTRACT_ADDRESS = '0x973da004D844384f7Cf1f5C338f61f970fAA4423';
  const stakingContractABI = [
	{
		"inputs": [],
		"name": "exit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getReward",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_plsDoge",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "_plsBone",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "RewardPaid",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "stake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Staked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "earned",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastUpdatedBlock",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "plsBone",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "plsDoge",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardPerToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardPerTokenStored",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "rewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userRewardPerTokenPaid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

  // Connect Wallet button click event
  const connectButton = document.getElementById('connectButton');
  connectButton.addEventListener('click', async () => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAccount = accounts[0];
        console.log(`User account: ${userAccount}`);

        // We don't know network version until we query it. We will use it later.
        const networkVersion = await window.ethereum.request({ method: 'net_version' });
        console.log(`Network version: ${networkVersion}`);

        // Initialize ethers.js provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        signer = provider.getSigner();

        // Initialize staking contract
        stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingContractABI, signer);

      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.log("MetaMask is not installed");
    }
  });

  // Stake button click event
  const stakeButton = document.getElementById('stakeButton');
  stakeButton.addEventListener('click', async () => {
    const amount = document.getElementById('amount').value;
    const amountToWei = ethers.utils.parseEther(amount);

    try {
      const tx = await stakingContract.stake(amountToWei);
      console.log('Transaction sent: ', tx);
    } catch (error) {
      console.error('Error occurred: ', error);
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
