// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IUserWhiteList {
    function isWhiteListed(address addr) view external returns(bool);
}
