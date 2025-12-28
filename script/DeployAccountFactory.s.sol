// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {AccountFactory} from "../src/Account.sol";

contract DeployAccountFactory is Script {
    function run() external returns (AccountFactory) {
        // Retrieve the private key from the environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start recording the transaction
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the AccountFactory contract
        AccountFactory accountFactory = new AccountFactory();

        // Stop recording
        vm.stopBroadcast();


        return accountFactory;
    }
}