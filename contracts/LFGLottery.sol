// SPDX-License-Identifier: MIT
// A lottery contract use the chainlink VRF and keeper service.
// Author: Xiao Shengguang

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./interfaces/ILFGLottery.sol";

contract LFGLottery is Ownable, ILFGLottery, VRFConsumerBaseV2, KeeperCompatibleInterface {
    using SafeERC20 for IERC20;

    event SetTicketPrice(address indexed sender, uint256 price);

    event SetRewardAmount(address indexed sender, uint256 amount);

    event BuyTicket(address indexed sender, uint256 count);

    event SetOperator(address indexed addr, bool isOperator);

    event RewardTicket(address indexed sender, address indexed seller, address indexed buyer);

    event SetMinimumPlayer(address indexed sender, uint256 minPlayer);

    event SetInterval(address indexed sender, uint256 interval);

    event SetCallBackGasLimit(address indexed sender, uint32 gasLimit);

    event SendTokenReward(address indexed winner, uint256 amount);

    VRFCoordinatorV2Interface public COORDINATOR;

    // Your subscription ID.
    uint64 public s_subscriptionId;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 public keyHash = 0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function. 2500000 is the maximum value in VRF config.
    uint32 public callbackGasLimit = 2500000;

    // The default is 3, but you can set this higher.
    uint16 public requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 public constant WINNER_COUNT = 3;

    uint256[WINNER_COUNT] public WINNER_REWARD_RATE = [50, 30, 20];

    uint256[] public s_randomWords;
    uint256 public s_requestId;

    address[] public players;

    uint256 public ticketPrice;

    uint256 public rewardAmount = 100e18;

    IERC20 public lfgToken;

    address public rewardHolder;

    mapping(address => bool) public operators;

    uint256 public rewardsPoolAmount = 0;

    uint256 public minimumPlayer = 3;

    /**
     * Public counter variable, record how many times the keeper executed
     */
    uint256 public runCounter;

    /**
     * Use an interval in seconds and a timestamp to slow execution of Upkeep
     */
    uint256 public interval;

    /**
     * The last time the keeper execute.
     */
    uint256 public lastTimeStamp;

    constructor(
        address _owner,
        IERC20 _lfgToken,
        address _rewardHolder,
        uint64 _subscriptionId,
        address _vrfCoordinator,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        require(_owner != address(0), "Invalid owner address");
        _transferOwnership(_owner);

        lfgToken = _lfgToken;

        rewardHolder = _rewardHolder;

        s_subscriptionId = _subscriptionId;
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        keyHash = _keyHash;

        interval = 7 days;
        lastTimeStamp = block.timestamp;

        runCounter = 0;
    }

    modifier onlyOperator() {
        require(operators[msg.sender], "Invalid operator for LFGLottery");
        _;
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() internal {
        // Will revert if subscription is not set and funded.
        if (players.length < minimumPlayer) {
            return;
        }

        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            WINNER_COUNT
        );
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        require(randomWords.length == WINNER_COUNT, "Invalid random words returned");
        require(players.length >= WINNER_COUNT, "Too little players");

        s_randomWords = randomWords;
        uint256 rewardsInThisRound = 0;
        for (uint32 i = 0; i < WINNER_COUNT; ++i) {
            uint256 winerIndex = s_randomWords[i] % players.length;
            uint256 rewards = (rewardsPoolAmount * WINNER_REWARD_RATE[i]) / 100;
            rewardsInThisRound += rewards;

            // Transfer from the msg.sender to winner address, the msg.sender for ERC20
            // contract "lfgToken", is the Lottery contract.
            lfgToken.safeTransfer(players[winerIndex], rewards);
            emit SendTokenReward(players[winerIndex], rewards);

            _removePlayer(winerIndex);
        }

        // Because the rounding error, the rewardsPoolAmount maybe different from rewardsInThisRound,
        // the left over amount will left for the next round.
        rewardsPoolAmount -= rewardsInThisRound;

        // clear all the players
        delete players;
    }

    function _removePlayer(uint256 index) internal {
        uint256 length = players.length;

        if (index != length - 1) {
            players[index] = players[length - 1];
        }

        // Remove the last element
        players.pop();
    }

    function setTicketPrice(uint256 price) external onlyOwner {
        ticketPrice = price;
        emit SetTicketPrice(msg.sender, ticketPrice);
    }

    function setRewardAmount(uint256 amount) external onlyOwner {
        rewardAmount = amount;
        emit SetRewardAmount(msg.sender, amount);
    }

    function setMinimumPlayer(uint256 minPlayer) external onlyOwner {
        minimumPlayer = minPlayer;
        emit SetMinimumPlayer(msg.sender, minPlayer);
    }

    function setInterval(uint256 updateInterval) external onlyOwner {
        interval = updateInterval;
        emit SetInterval(msg.sender, interval);
    }

    function setCallBackGasLimit(uint32 gasLimit) external onlyOwner {
        callbackGasLimit = gasLimit;
        emit SetCallBackGasLimit(msg.sender, gasLimit);
    }

    function buyTicket(uint256 count) external {
        uint256 totalPrice = ticketPrice * count;
        SafeERC20.safeTransferFrom(lfgToken, msg.sender, address(this), totalPrice);
        for (uint256 i = 0; i < count; ++i) {
            players.push(msg.sender);
        }

        rewardsPoolAmount += totalPrice;

        emit BuyTicket(msg.sender, count);
    }

    function setOperator(address _account, bool _isOperator) external onlyOwner {
        require(_account != address(0), "Invalid address");

        operators[_account] = _isOperator;

        emit SetOperator(_account, _isOperator);
    }

    function rewardTicket(address seller, address buyer) external override onlyOperator {
        lfgToken.safeTransferFrom(rewardHolder, address(this), rewardAmount * 2);
        players.push(seller);
        players.push(buyer);

        rewardsPoolAmount += rewardAmount * 2;

        emit RewardTicket(msg.sender, seller, buyer);
    }

    function getPlayerCount() public view returns (uint256) {
        return players.length;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded =
            (block.timestamp - lastTimeStamp) > interval &&
            players.length >= WINNER_COUNT;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval && players.length >= WINNER_COUNT) {
            lastTimeStamp = block.timestamp;
            runCounter = runCounter + 1;

            requestRandomWords();
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }
}
