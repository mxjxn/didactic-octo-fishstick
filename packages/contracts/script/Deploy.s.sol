// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/GameRegistry.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy GameRegistry
        GameRegistry registry = new GameRegistry();
        console.log("GameRegistry deployed at:", address(registry));

        vm.stopBroadcast();
    }
}
