import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amount, setAmount] = useState("");
  const [Maxbalance, setMaxBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const MaxBalance = async () => {
    if (atm) {
      setMaxBalance((await atm.MaxBalance()).toNumber());
    }
  };

  const deposit5 = async () => {
    if (atm) {
      let tx = await atm.deposit(5);
      await tx.wait();
      getBalance();
      MaxBalance();
    }
  };
  const deposit10 = async () => {
    if (atm) {
      let tx = await atm.deposit(10);
      await tx.wait();
      getBalance();
      MaxBalance();
    }
  };

  const deposit = async () => {
    setAmount(Number(amount) < 0 ? 0 : Number(amount));
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw5 = async () => {
    if (atm) {
      let tx = await atm.withdraw(5);
      await tx.wait();
      getBalance();
      MaxBalance();
    }
  };
  const withdraw10 = async () => {
    if (atm) {
      let tx = await atm.withdraw(10);
      await tx.wait();
      getBalance();
      MaxBalance();
    }
  };

  const withdraw = async () => {
    setAmount(Number(amount) < 0 ? 0 : Number(amount));
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Account: {account}</p>
        <p>Balance: {balance} ETH</p>
        <p>More Ether that can be deposit: {Maxbalance}</p>
        <p>
          you can transact 5 or 10 Token with one click or give a custom amount
          below
        </p>
        <button
          onClick={deposit5}
          style={{
            padding: "3px",
            cursor: "pointer",
            backgroundColor: "green",
            margin: "3px",
          }}
        >
          Deposit 5 Token
        </button>
        <button
          onClick={withdraw5}
          style={{
            padding: "3px",
            cursor: "pointer",
            backgroundColor: "red",
            margin: "3px",
          }}
        >
          Withdraw 5 Token
        </button>
        <br />
        <button
          onClick={deposit10}
          style={{
            padding: "3px",
            cursor: "pointer",
            backgroundColor: "green",
            margin: "3px",
          }}
        >
          Deposit 10 Token
        </button>
        <button
          onClick={withdraw10}
          style={{
            padding: "3px",
            cursor: "pointer",
            backgroundColor: "red",
            margin: "3px",
          }}
        >
          Withdraw 10 Token
        </button>
        <br />
        <form>
          <label>
            Enter ether amount:
            <input
              type="text"
              placeholder="enter min 1 eth"
              value={amount}
              style={{ padding: "2px", marginBottom: "10px" }}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
        </form>
        <button
          onClick={deposit}
          style={{
            backgroundColor: "limegreen",
            padding: "5px",
            marginRight: "5px",
            cursor: "pointer",
          }}
        >
          Deposit {amount} ETH
        </button>
        <button
          onClick={withdraw}
          style={{
            backgroundColor: "rosybrown",
            padding: "5px",
            marginRight: "5px",
            cursor: "pointer",
          }}
        >
          Withdraw {amount} ETH
        </button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main
      className="container"
      style={{ backgroundColor: "#eeeedd", height: "100vh" }}
    >
      <header>
        <h1>Welcome to the GO ATM!</h1>
      </header>
      <hr></hr>
      <h3>
        {" "}
        Here you can dirctly diposit or withdraw token in your metamask wallet{" "}
      </h3>
      <hr></hr>
      <h4> !! Max limit has been set at 100 Token in smart contract</h4>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
          }
          header {
            color: blue;
          }
          h3 {
            color: blue;
          }
          h4 {
            color: red;
          }
        `}
      </style>
    </main>
  );
}
