let web3;
let walletAddress = "";

// Połączenie portfela MetaMask
async function connectMetaMask() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      walletAddress = accounts[0];
      alert(`Połączono z MetaMask! Adres: ${walletAddress}`);
    } catch (error) {
      console.error("Błąd połączenia MetaMask:", error);
    }
  } else {
    alert("MetaMask nie jest zainstalowany!");
  }
}

// Funkcja zatwierdzania tokenów
async function approveToken() {
  if (!web3 || !walletAddress) {
    alert("Najpierw połącz swój portfel!");
    return;
  }

  const spenderAddress = "0x1234567890abcdef1234567890abcdef12345678";
  const tokenAddress = document.getElementById("from-token").value;
  const amount = document.getElementById("amount").value;

  if (!amount || amount <= 0) {
    alert("Podaj poprawną kwotę!");
    return;
  }

  const erc20Abi = [
    { "constant": false, "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
  ];

  try {
    const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
    const tx = await tokenContract.methods.approve(spenderAddress, web3.utils.toWei(amount, "ether"))
      .send({ from: walletAddress });
    alert("Token zatwierdzony pomyślnie!");
    console.log("Transakcja zatwierdzenia:", tx);
  } catch (error) {
    console.error("Błąd zatwierdzania tokena:", error);
    alert("Wystąpił problem podczas zatwierdzania tokena.");
  }
}

// Połączenie funkcji z przyciskami
document.querySelector(".connect-wallet").addEventListener("click", connectMetaMask);
document.querySelector(".approve-btn").addEventListener("click", approveToken);
