// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "@account-abstraction/contracts/core/EntryPoint.sol";

contract DeployEntryPoint is Script {
    function run() external returns (EntryPoint) {
        // Retrieve the private key from the environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start recording the transaction
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the EntryPoint contract
        EntryPoint entryPoint = new EntryPoint();

        // Stop recording
        vm.stopBroadcast();

        // Log the deployed address
        console.log("EntryPoint deployed at:", address(entryPoint));

        return entryPoint;
    }
}