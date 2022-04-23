// SPDX-License-Identifier: MIT

//** User Whitelist Contract */
//** Author Xiao Shengguang : User Whitelist Contract 2022.1 */
//** Only whitelisted user can create on the NFT contract    */

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IUserWhiteList.sol";

contract UserWhiteList is Ownable, IUserWhiteList {
    event SetUserWhitelist(address indexed addr, bool isWhitelist);

    event SetOperator(address indexed addr, bool isOperator);

    // The user contract whitelists, only whitelisted user can mint on the NFT contract
    mapping(address => bool) public userWhiteLists;

    mapping(address => bool) public operators;

    constructor(address _owner) {
        require(_owner != address(0), "Invalid owner address");
        _transferOwnership(_owner);
    }

    modifier onlyOperatorOrOwner() {
        require(operators[msg.sender] || msg.sender == owner(), "NFT: Invalid operator");
        _;
    }

    function setOperator(address _account, bool _isOperator) external onlyOwner {
        require(_account != address(0), "Invalid address");

        operators[_account] = _isOperator;

        emit SetOperator(_account, _isOperator);
    }

    function setUserWhitelist(address[] calldata _addresses, bool[] calldata _isWhitelist)
        external
        onlyOperatorOrOwner
    {
        require(_addresses.length == _isWhitelist.length, "Invalid array length");

        for (uint256 i = 0; i < _addresses.length; i++) {
            require(_addresses[i] != address(0), "Invalid user address");

            userWhiteLists[_addresses[i]] = _isWhitelist[i];

            emit SetUserWhitelist(_addresses[i], _isWhitelist[i]);
        }
    }

    function isWhiteListed(address addr) external view override returns (bool) {
        return userWhiteLists[addr];
    }
}
