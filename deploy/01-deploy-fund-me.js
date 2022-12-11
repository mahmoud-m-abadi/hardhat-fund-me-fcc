// function deployFunc(hre) {
//     console.log("Hi!")
// }

const { network } = require("hardhat")
const {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify.js")

// module.exports.default = deployFunc()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    if (chainId != 31337) {
        // verify
        await verify(fundMe.address, args)
    }
    log("--------------------------------------")
    // log("Deployed!!")
}

module.exports.tags = ["all", "fundme"]
