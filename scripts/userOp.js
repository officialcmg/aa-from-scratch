import { encodePacked, keccak256, toHex, getContractAddress, encodeFunctionData, parseEther } from 'viem';
import { publicClient, walletClient, getNonce, getCount, accountAbi, accountFactoryAbi, entryPointAbi } from './utils.js';

const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = '0x16Df0a8d6be7C281b2a36e54078dE0F3f63Cb422';
const EP_ADDRESS = '0x5F222482e075414455B081FdEDa97e83f6606519';
const signer = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const senderAddress = getContractAddress({
    from: FACTORY_ADDRESS,
    nonce: BigInt(FACTORY_NONCE),
});

// we already deployed the account
// const initCode = FACTORY_ADDRESS + encodeFunctionData({
//   abi: accountFactoryAbi,
//   functionName: 'createAccount',
//   args: [signer]
// }).slice(2) 

const initCode = '0x'

const calldata = encodeFunctionData({
  abi: accountAbi,
  functionName: 'execute',
})

// UserOperation struct matching the Solidity definition
const userOp = {
  sender: senderAddress,
  nonce: await getNonce(senderAddress),
  initCode: initCode,
  callData: calldata,
  callGasLimit: 200000n,
  verificationGasLimit: 500000n,
  preVerificationGas: 50000n,
  maxFeePerGas: 10000000000n, // 10 gwei
  maxPriorityFeePerGas: 5000000000n, // 5 gwei
  paymasterAndData: '0x',
  signature: '0x',
};

console.log('UserOperation:', userOp);
console.log('Sender address:', senderAddress);

// Prefund the sender account via EntryPoint depositTo
console.log('Prefunding sender account...');
const depositHash = await walletClient.sendTransaction({
  to: EP_ADDRESS,
  value: parseEther('1'),
  data: encodeFunctionData({
    abi: entryPointAbi,
    functionName: 'depositTo',
    args: [senderAddress]
  })
});
console.log('Deposit tx:', depositHash);

// Wait for deposit to be mined
await publicClient.waitForTransactionReceipt({ hash: depositHash });

// call handleOps method of entrypoint with userOp as the first arg and signer as the second address
const { request } = await publicClient.simulateContract({
  account: signer,
  address: EP_ADDRESS,
  abi: entryPointAbi,
  functionName: 'handleOps',
  args: [[userOp], signer]
})
const hash = await walletClient.writeContract(request)

console.log('Tx hash: ', hash);

// // Example: pack the userOp (excluding signature) for hashing
// const packedUserOp = encodePacked(
//   ['address', 'uint256', 'bytes32', 'bytes32', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes32'],
//   [
//     userOp.sender,
//     userOp.nonce,
//     keccak256(userOp.initCode),
//     keccak256(userOp.callData),
//     userOp.callGasLimit,
//     userOp.verificationGasLimit,
//     userOp.preVerificationGas,
//     userOp.maxFeePerGas,
//     userOp.maxPriorityFeePerGas,
//     keccak256(userOp.paymasterAndData),
//   ]
// );

// console.log('Packed UserOp (for hashing):', packedUserOp);
// console.log('UserOp Hash:', keccak256(packedUserOp));
