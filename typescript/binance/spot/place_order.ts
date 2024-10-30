/**
 * @title Place a Spot Order on Binance
 * @description Example showing how to place a spot order using the Quantapi.io SDK
 * @category spot
 * @tags orders,trading
 */

import { BinanceClient } from "binance";

async function placeSpotOrder() {
    const client = new BinanceClient({
        apiKey: "your-api-key",
        apiSecret: "your-api-secret",
    });

    const order = await client.spot.createOrder({
        symbol: "BTCUSDT",
        side: "BUY",
        type: "LIMIT",
        quantity: "0.001",
        price: "30000",
    });

    console.log("Order placed:", order);
}
