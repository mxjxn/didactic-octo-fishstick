// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/GameRegistry.sol";

contract GameRegistryTest is Test {
    GameRegistry public registry;
    address public player1;
    address public player2;

    function setUp() public {
        registry = new GameRegistry();
        player1 = makeAddr("player1");
        player2 = makeAddr("player2");

        vm.deal(player1, 10 ether);
        vm.deal(player2, 10 ether);
    }

    function testGameCreation() public {
        // TODO: Implement test when contract is ready
        assertTrue(true, "Placeholder test");
    }

    function testJoinGame() public {
        // TODO: Implement test when contract is ready
        assertTrue(true, "Placeholder test");
    }

    function testFinishGame() public {
        // TODO: Implement test when contract is ready
        assertTrue(true, "Placeholder test");
    }
}
