import {
  UnsignedTransactionRequest,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import {
  Abi,
  Address,
  createPublicClient,
  encodeFunctionData,
  formatEther,
  http,
  parseEther,
} from "viem";
import { arbitrumSepolia, mainnet } from "viem/chains";

const abi = [
  {
    inputs: [
      { internalType: "string", name: "name_", type: "string" },
      { internalType: "string", name: "symbol_", type: "string" },
      { internalType: "uint8", name: "decimals_", type: "uint8" },
      { internalType: "uint256", name: "initialBalance_", type: "uint256" },
      {
        internalType: "address payable",
        name: "feeReceiver_",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const satisfies Abi;

const ARBITRUM_SEPOLIA_USDC: Address =
  "0x8A87497488073307E1a17e8A12475a94Afcb413f";

const Jay01: Address = "0x763a67e57b36229ad9ffdf62b6256d864b61ce28";
// const Vip01: Address = "0xf422673cb7a673f595852f7b00906408a0b073db";

function App() {
  const { wallets } = useWallets();
  const { ready, user, authenticated, login, logout, sendTransaction } = usePrivy();
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  useEffect(() => {
    console.log("wallets", wallets);
  }, [wallets]);

  const handleGetAllowance = async () => {
    const owner = wallets.at(0)?.address;
    if (owner) {
      const publicClient = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
      });
      const allowance = await publicClient.readContract({
        abi,
        address: ARBITRUM_SEPOLIA_USDC,
        functionName: "allowance",
        args: [owner as Address, Jay01],
      });
      console.log("allowance", formatEther(allowance));
    }
  };

  const handleApprove = async () => {
    const owner = wallets.at(0)?.address;
    if (owner) {
      const requestData: UnsignedTransactionRequest = {
        to: ARBITRUM_SEPOLIA_USDC,
        // chainId: arbitrumSepolia.id,
        data: encodeFunctionData({
          abi,
          functionName: "approve",
          args: [Jay01, parseEther(input)],
        }),
      };
      const receipt = await sendTransaction(requestData);
      console.log("receipt", receipt);
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center">
      <button onClick={login} disabled={!ready || authenticated}>
        Login
      </button>
      <button onClick={logout} disabled={!ready || !authenticated}>Logout</button>
      <button
        onClick={async () => {
          const wallet = wallets.at(0);
          if (wallet) {
            wallet.switchChain(arbitrumSepolia.id);
          }
        }}
      >
        Switch to Arbitrum Sepolia
      </button>
      <button
        onClick={async () => {
          const wallet = wallets.at(0);
          if (wallet) {
            wallet.switchChain(mainnet.id);
          }
        }}
      >
        Switch to Mainnet
      </button>

      <button onClick={handleGetAllowance}>Get Allowance</button>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Amount" />
      <button onClick={handleApprove}>Approve</button>
    </div>
  );
}

export default App;
