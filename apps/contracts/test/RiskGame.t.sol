// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/RiskGame.sol";

contract RiskGameTest is Test {
    RiskGame public game;

    function setUp() public {
        game = new RiskGame();
    }

    function testPlaceholder() public {
        // Placeholder test
        assertTrue(true);
    }
}
