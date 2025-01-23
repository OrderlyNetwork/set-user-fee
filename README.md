# Orderly User Fee Setting Tool

This tool allows you to set custom trading fee rates for specific users on Orderly Network. You can set both maker and taker fees for multiple user addresses at once.

## Prerequisites

Before you can use this tool, you need to:

1. Install Node.js on your computer
   - Visit [https://nodejs.org/](https://nodejs.org/)
   - Download and install the "LTS" (Long Term Support) version
   - To verify installation, open Command Prompt (Windows) or Terminal (Mac/Linux) and type:
     ```sh
     node --version
     ```
   - You should see a version number like v18.x.x

2. Get your Orderly Network credentials:
   - Visit [Orderly Broker Registration](https://orderlynetwork.github.io/broker-registration/)
   - Get your Account ID, Secret Key, and Broker ID from your Orderly admin wallet

## Setup Instructions

1. Download the tool:
   - Go to the GitHub repository page
   - Click the green "Code" button
   - Select "Download ZIP" from the dropdown menu
   - Save the ZIP file to your computer

2. Extract the zip file:
   - Windows: Right-click the ZIP file and select "Extract All"
   - Mac: Double-click the ZIP file
   - Choose a location on your computer where you want to extract the files

3. Open the extracted folder and open Command Prompt/Terminal in that location:
   - Windows: Inside the extracted folder, hold Shift + Right-click and select "Open PowerShell window here" or "Open command window here"
   - Mac: Inside the extracted folder, right-click and select "New Terminal at Folder"
   - Alternative for both: Open the extracted folder in File Explorer (Windows) or Finder (Mac), click in the address/path bar, type "cmd" (Windows) or "terminal" (Mac) and press Enter

4. Install the required dependencies by running:
   ```
   npm install
   ```

5. Open the `index.ts` file in a text editor and update the following values:
   ```typescript
   // Your Orderly account ID from the admin wallet
   const adminAddress = "your-admin-evm-or-sol-address-here";

   // Your Orderly secret key from the admin wallet
   const orderlyAdminSecret = "ed25519:your-admin-secret-key-here";

   // Your broker ID
   const brokerId = "your-broker-id-here";

   // Set your desired fee rates
   const makerFeeRate = 0;           // e.g., 0 for 0% fee
   const takerFeeRate = 0.0003;      // e.g., 0.0003 for 0.03% fee

   // List of user addresses to update
   const addresses = [
      "0xAddress1...",
      "0xAddress2...",
   ];
   ```

   Note about fees:
   - Fees are set as decimal numbers
   - Example: 0.0001 = 0.01% fee
   - Example: 0.00005 = 0.005% fee
   - The minimum taker fee is 0.03% (0.0003)

6. Save the file after making your changes

## Running the Tool

1. In the Command Prompt/Terminal window you opened earlier, run:
   ```
   npm start
   ```

2. The tool will execute and show the response from Orderly Network

## Troubleshooting

If you encounter any errors:

- Make sure Node.js is properly installed
- Verify that you ran `npm install`
- Double-check your Orderly credentials
- Ensure all addresses in the list are valid Ethereum addresses
- Verify that the fee rates are within acceptable ranges
