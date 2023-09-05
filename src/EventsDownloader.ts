import {
    EndBlockTypeWhenInit,
    MainnetDataDownloader,
  } from "@bella-defintech/uniswap-v3-simulator";
  import { EventDataSourceType } from '@bella-defintech/uniswap-v3-simulator';
  
  console.log(EventDataSourceType);
  
  const MAX_RETRIES = 50000;
  let retryCount = 0;
  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  async function main() {
    //let poolName = "events_16725679";
    let poolName = `events_${retryCount}`;
    let poolAddress = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640";
    
    // let RPCProviderUrl: string | undefined = 'https://eth-mainnet.g.alchemy.com/v2/Jr--Ya6Tw6l8MWvDxTlVhWsTkOz_Zt4s'; 
    let RPCProviderUrl: string | undefined = 'https://eth-mainnet.g.alchemy.com/v2/D5vUkHL6m0RB2fsswWrmsynzVtI264XC'; 
    let mainnetDataDownloader = new MainnetDataDownloader(RPCProviderUrl, EventDataSourceType.RPC);
    let endBlock: EndBlockTypeWhenInit = 17386162;
  
    await mainnetDataDownloader.download(poolName, poolAddress, endBlock);
  }
  
  async function runMainWithRetry() {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
  
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Error encountered. Retrying (${retryCount}/${MAX_RETRIES})...`);
        
        await sleep(61000);
  
        runMainWithRetry();
      } else {
        console.log('Max retries reached. Exiting.');
        process.exit(1);
      }
    }
  }
  
  runMainWithRetry();
  