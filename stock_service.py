# stock_service.py

import yfinance as yf

# Company Name -> Stock Symbol Mapping
STOCK_SYMBOLS = {
    "apple": "AAPL",
    "tesla": "TSLA",
    "google": "GOOGL",
    "alphabet": "GOOGL",
    "microsoft": "MSFT",
    "amazon": "AMZN",
    "meta": "META",
    "netflix": "NFLX",
    "nvidia": "NVDA",

    # Indian Stocks
    "tcs": "TCS.NS",
    "infosys": "INFY.NS",
    "reliance": "RELIANCE.NS",
    "hdfc": "HDFCBANK.NS",
    "icici": "ICICIBANK.NS",
    "wipro": "WIPRO.NS",
    "sbi": "SBIN.NS",
    "adani enterprises": "ADANIENT.NS",
    "adani ports": "ADANIPORTS.NS",
    "itc": "ITC.NS",
    "asian paints": "ASIANPAINT.NS"
}


def get_stock_symbol(user_input):
    """
    Converts company name to stock symbol.
    If user enters a symbol directly, it returns it.
    """

    user_input = user_input.strip().lower()

    if user_input in STOCK_SYMBOLS:
        return STOCK_SYMBOLS[user_input]

    return user_input.upper()


def get_stock_data(user_input):
    """
    Fetches stock information using yfinance.
    """

    try:

        symbol = get_stock_symbol(user_input)

        stock = yf.Ticker(symbol)

        info = stock.info

        history = stock.history(period="6mo")

        if history.empty:
            return {
                "success": False,
                "message": "No stock data found."
            }

        latest = history.iloc[-1]

        historical_data = []

        for index, row in history.iterrows():

            historical_data.append({
                "date": index.strftime("%Y-%m-%d"),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"])
            })

        response = {

            "success": True,

            "companyName": info.get("longName", symbol),

            "symbol": symbol,

            "currentPrice": info.get(
                "currentPrice",
                round(float(latest["Close"]), 2)
            ),

            "currency": info.get("currency", "USD"),

            "marketState": info.get("marketState", "Unknown"),

            "open": round(float(latest["Open"]), 2),

            "high": round(float(latest["High"]), 2),

            "low": round(float(latest["Low"]), 2),

            "close": round(float(latest["Close"]), 2),

            "volume": int(latest["Volume"]),

            "history": historical_data
        }

        return response

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# -----------------------------
# Testing
# -----------------------------
import json
import sys

if __name__ == "__main__":

    symbol = "AAPL"

    if len(sys.argv) > 1:
        symbol = sys.argv[1]

    result = get_stock_data(symbol)

    print(json.dumps(result))
