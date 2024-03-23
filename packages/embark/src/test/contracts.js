/* global describe it */

import { File, Types } from "embark-utils";

import ContractsManager from 'embark-contracts-manager';
import { Logger } from 'embark-logger';
import { Events, IPC, TestLogger, Plugins } from 'embark-core';
import findUp from 'find-up';
let assert = require('assert');

let readFile = function(file) {
  return new File({filename: file, type: Types.dappFile, path: file});
};

// will need refactor if we some day switch back to specifying version ranges
const currentSolcVersion = require(findUp.sync(
  'node_modules/embark-solidity/package.json',
  {cwd: __dirname}
)).dependencies.solc;
const TestEvents = {
  request: (cmd, cb) => {
    cb(currentSolcVersion);
  },
  emit: (_ev, _data) => {}
};

describe('embark.Contracts', function() {
  this.timeout(0);
  describe('simple', function() {
    let plugins = new Plugins({
      logger: new TestLogger({}),
      events: TestEvents,
      config: {
        contractDirectories: ['app/contracts/'],
        embarkConfig: {
          options: {
            solc: {
              "optimize": true,
              "optimize-runs": 200
            }
          }
        },
        package: {
          dependencies: { solc: currentSolcVersion }
        }
      }
    });
    let ipcObject = new IPC({
      ipcRole: 'none'
    });
    plugins.loadInternalPlugin('embark-solidity', {ipc: ipcObject}, true);

    let events = new Events();
    let contractsConfig;

    events.setCommandHandler("config:contractsConfig", function(cb) {
      cb(contractsConfig);
    });

    events.setCommandHandler("config:contractsFiles", (cb) => {
      cb([
        readFile('contracts/simple_storage.sol'),
        readFile('contracts/token.sol')
      ]);
    });

    events.setCommandHandler("blockchain:gasPrice", (cb) => {
      cb(null, 100);
    });

    contractsConfig = {
      "versions": {
        "solc": "0.4.17"
      },
      "deployment": {
        "host": "localhost",
        "port": 8545,
        "type": "rpc"
      },
      "dappConnection": [
        "$WEB3",
        "ws://localhost:8546",
        "localhost:8545"
      ],
      "gas": "auto",
      "contracts": {
        "Token": {
          "args": [100]
        },
        "SimpleStorage": {
          "args": [200]
        }
      }
    };

    let embarkObj = {
      registerAPICall: () => {},
      fs: {
        existsSync: () => { return false; },
        dappPath: () => { return "ok"; }
      },
      logger: new Logger({}),
      events: events
    };

    let contractsManager = new ContractsManager(embarkObj, {
      plugins: plugins,
      contractDirectories: ['app/contracts']
    });

    const compiledContracts = {
      SimpleStorage: {"code":"608060405234801561001057600080fd5b506040516020806101358339810180604052602081101561003057600080fd5b505160005560f2806100436000396000f3fe60806040526004361060525763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632a1afcd98114605757806360fe47b114607b5780636d4ce63c1460a3575b600080fd5b348015606257600080fd5b50606960b5565b60408051918252519081900360200190f35b348015608657600080fd5b5060a160048036036020811015609b57600080fd5b503560bb565b005b34801560ae57600080fd5b50606960c0565b60005481565b600055565b6000549056fea165627a7a72305820f0f0591d202a197356437f28668ae8710c45231f114a6a93ed48996f2866269c0029","linkReferences":{},"runtimeBytecode":"60806040526004361060525763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632a1afcd98114605757806360fe47b114607b5780636d4ce63c1460a3575b600080fd5b348015606257600080fd5b50606960b5565b60408051918252519081900360200190f35b348015608657600080fd5b5060a160048036036020811015609b57600080fd5b503560bb565b005b34801560ae57600080fd5b50606960c0565b60005481565b600055565b6000549056fea165627a7a72305820f0f0591d202a197356437f28668ae8710c45231f114a6a93ed48996f2866269c0029","realRuntimeBytecode":"60806040526004361060525763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632a1afcd98114605757806360fe47b114607b5780636d4ce63c1460a3575b600080fd5b348015606257600080fd5b50606960b5565b60408051918252519081900360200190f35b348015608657600080fd5b5060a160048036036020811015609b57600080fd5b503560bb565b005b34801560ae57600080fd5b50606960c0565b60005481565b600055565b6000549056fea165627a7a72305820","swarmHash":"f0f0591d202a197356437f28668ae8710c45231f114a6a93ed48996f2866269c","gasEstimates":{"creation":{"codeDepositCost":"48400","executionCost":"20172","totalCost":"68572"},"external":{"get()":"428","set(uint256)":"20197","storedData()":"384"}},"functionHashes":{"get()":"6d4ce63c","set(uint256)":"60fe47b1","storedData()":"2a1afcd9"},"abiDefinition":[{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialValue","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}],"userdoc":{"methods":{}},"filename":"/Users/emizzle/Code/__Github/embk-fw/embark/dapps/templates/demo/.embark/contracts/simple_storage.sol","originalFilename":"contracts/simple_storage.sol"},
      Token: {"code":"608060405234801561001057600080fd5b506040516020806104d78339810180604052602081101561003057600080fd5b5051336000908152602081905260409020819055600255610481806100566000396000f3fe6080604052600436106100775763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663095ea7b3811461007c57806318160ddd146100c957806323b872dd146100f057806370a0823114610133578063a9059cbb14610166578063dd62ed3e1461019f575b600080fd5b34801561008857600080fd5b506100b56004803603604081101561009f57600080fd5b50600160a060020a0381351690602001356101da565b604080519115158252519081900360200190f35b3480156100d557600080fd5b506100de610240565b60408051918252519081900360200190f35b3480156100fc57600080fd5b506100b56004803603606081101561011357600080fd5b50600160a060020a03813581169160208101359091169060400135610246565b34801561013f57600080fd5b506100de6004803603602081101561015657600080fd5b5035600160a060020a0316610352565b34801561017257600080fd5b506100b56004803603604081101561018957600080fd5b50600160a060020a03813516906020013561036d565b3480156101ab57600080fd5b506100de600480360360408110156101c257600080fd5b50600160a060020a0381358116916020013516610423565b336000818152600160209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60025490565b600160a060020a03831660009081526020819052604081205482111561026b57600080fd5b600160a060020a038416600090815260016020908152604080832033845290915290205482111561029b57600080fd5b600160a060020a0383166000908152602081905260409020546102be908361044e565b15156102c957600080fd5b600160a060020a03808516600081815260016020908152604080832033845282528083208054889003905583835282825280832080548890039055938716808352918490208054870190558351868152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35060019392505050565b600160a060020a031660009081526020819052604090205490565b3360009081526020819052604081205482111561038957600080fd5b600160a060020a0383166000908152602081905260409020546103ac908361044e565b15156103b757600080fd5b3360008181526020818152604080832080548790039055600160a060020a03871680845292819020805487019055805186815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350600192915050565b600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b810110159056fea165627a7a72305820e438e2fa4cb5fa84101177e6a2da22bc34f14729c7053a629a977547d41645d70029","linkReferences":{},"runtimeBytecode":"6080604052600436106100775763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663095ea7b3811461007c57806318160ddd146100c957806323b872dd146100f057806370a0823114610133578063a9059cbb14610166578063dd62ed3e1461019f575b600080fd5b34801561008857600080fd5b506100b56004803603604081101561009f57600080fd5b50600160a060020a0381351690602001356101da565b604080519115158252519081900360200190f35b3480156100d557600080fd5b506100de610240565b60408051918252519081900360200190f35b3480156100fc57600080fd5b506100b56004803603606081101561011357600080fd5b50600160a060020a03813581169160208101359091169060400135610246565b34801561013f57600080fd5b506100de6004803603602081101561015657600080fd5b5035600160a060020a0316610352565b34801561017257600080fd5b506100b56004803603604081101561018957600080fd5b50600160a060020a03813516906020013561036d565b3480156101ab57600080fd5b506100de600480360360408110156101c257600080fd5b50600160a060020a0381358116916020013516610423565b336000818152600160209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60025490565b600160a060020a03831660009081526020819052604081205482111561026b57600080fd5b600160a060020a038416600090815260016020908152604080832033845290915290205482111561029b57600080fd5b600160a060020a0383166000908152602081905260409020546102be908361044e565b15156102c957600080fd5b600160a060020a03808516600081815260016020908152604080832033845282528083208054889003905583835282825280832080548890039055938716808352918490208054870190558351868152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35060019392505050565b600160a060020a031660009081526020819052604090205490565b3360009081526020819052604081205482111561038957600080fd5b600160a060020a0383166000908152602081905260409020546103ac908361044e565b15156103b757600080fd5b3360008181526020818152604080832080548790039055600160a060020a03871680845292819020805487019055805186815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350600192915050565b600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b810110159056fea165627a7a72305820e438e2fa4cb5fa84101177e6a2da22bc34f14729c7053a629a977547d41645d70029","realRuntimeBytecode":"6080604052600436106100775763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663095ea7b3811461007c57806318160ddd146100c957806323b872dd146100f057806370a0823114610133578063a9059cbb14610166578063dd62ed3e1461019f575b600080fd5b34801561008857600080fd5b506100b56004803603604081101561009f57600080fd5b50600160a060020a0381351690602001356101da565b604080519115158252519081900360200190f35b3480156100d557600080fd5b506100de610240565b60408051918252519081900360200190f35b3480156100fc57600080fd5b506100b56004803603606081101561011357600080fd5b50600160a060020a03813581169160208101359091169060400135610246565b34801561013f57600080fd5b506100de6004803603602081101561015657600080fd5b5035600160a060020a0316610352565b34801561017257600080fd5b506100b56004803603604081101561018957600080fd5b50600160a060020a03813516906020013561036d565b3480156101ab57600080fd5b506100de600480360360408110156101c257600080fd5b50600160a060020a0381358116916020013516610423565b336000818152600160209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60025490565b600160a060020a03831660009081526020819052604081205482111561026b57600080fd5b600160a060020a038416600090815260016020908152604080832033845290915290205482111561029b57600080fd5b600160a060020a0383166000908152602081905260409020546102be908361044e565b15156102c957600080fd5b600160a060020a03808516600081815260016020908152604080832033845282528083208054889003905583835282825280832080548890039055938716808352918490208054870190558351868152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35060019392505050565b600160a060020a031660009081526020819052604090205490565b3360009081526020819052604081205482111561038957600080fd5b600160a060020a0383166000908152602081905260409020546103ac908361044e565b15156103b757600080fd5b3360008181526020818152604080832080548790039055600160a060020a03871680845292819020805487019055805186815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350600192915050565b600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b810110159056fea165627a7a72305820","swarmHash":"e438e2fa4cb5fa84101177e6a2da22bc34f14729c7053a629a977547d41645d7","gasEstimates":{"creation":{"codeDepositCost":"230600","executionCost":"40428","totalCost":"271028"},"external":{"allowance(address,address)":"860","approve(address,uint256)":"22377","balanceOf(address)":"711","totalSupply()":"406","transfer(address,uint256)":"43589","transferFrom(address,address,uint256)":"64444"},"internal":{"safeToAdd(uint256,uint256)":"24"}},"functionHashes":{"allowance(address,address)":"dd62ed3e","approve(address,uint256)":"095ea7b3","balanceOf(address)":"70a08231","totalSupply()":"18160ddd","transfer(address,uint256)":"a9059cbb","transferFrom(address,address,uint256)":"23b872dd"},"abiDefinition":[{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"ok","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"ok","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"value","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"ok","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"_allowance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initial_balance","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}],"userdoc":{"methods":{}},"filename":"/Users/emizzle/Code/__Github/embk-fw/embark/dapps/templates/demo/.embark/contracts/token.sol","originalFilename":"contracts/token.sol"}
    };

    describe('#build', function() {
      it('generate contracts', function(done) {
        contractsManager.buildContracts(contractsConfig, compiledContracts, function(err, _result) {
          if (err) {
            throw err;
          }

          let contracts = contractsManager.listContracts();
          assert.equal(contracts.length, 2);

          assert.equal(contracts[0].deploy, true);
          assert.deepEqual(contracts[0].args, [100]);
          assert.equal(contracts[0].className, "Token");
          //assert.deepEqual(contracts[0].gas, 725000);
          assert.deepEqual(contracts[0].gas, 'auto');
          //assert.equal(contracts[0].gasPrice, []); // TODO: test this one
          assert.equal(contracts[0].type, 'file');
          //assert.equal(contracts[0].abiDefinition, '');
          //assert.equal(contracts[0].code, '');
          //assert.equal(contracts[0].runtimeBytecode, '');

          assert.equal(contracts[1].deploy, true);
          assert.deepEqual(contracts[1].args, [200]);
          assert.equal(contracts[1].className, "SimpleStorage");
          //assert.deepEqual(contracts[1].gas, 725000);
          assert.deepEqual(contracts[1].gas, 'auto');
          //assert.equal(contracts[1].gasPrice, []); // TODO: test this one
          assert.equal(contracts[1].type, 'file');
          //assert.equal(contracts[1].abiDefinition, '');
          //assert.equal(contracts[1].code, '');
          //assert.equal(contracts[1].runtimeBytecode, '');
          done();
        });
      });
    });
  });

  describe('config with contract instances', function() {
    let plugins = new Plugins({
      logger: new TestLogger({}),
      events: TestEvents,
      config: {
        contractDirectories: ['app/contracts/'],
        embarkConfig: {
          options: {
            solc: {
              "optimize": true,
              "optimize-runs": 200
            }
          }
        },
        package: {
          dependencies: { solc: currentSolcVersion }
        }
      }
    });
    let ipcObject = new IPC({
      ipcRole: 'none'
    });
    plugins.loadInternalPlugin('embark-solidity', {ipc: ipcObject}, true);

    let events = new Events();
    let contractsConfig;

    events.setCommandHandler("config:contractsConfig", function(cb) {
      cb(contractsConfig);
    });

    events.setCommandHandler("config:contractsFiles", (cb) => {
      cb([
        readFile('contracts/simple_storage.sol'),
        readFile('contracts/token_storage.sol')
      ]);
    });

    events.setCommandHandler("blockchain:gasPrice", (cb) => {
      cb(null, 100);
    });

    contractsConfig = {
      "versions": {
        "solc": "0.4.17"
      },
      "deployment": {
        "host": "localhost",
        "port": 8545,
        "type": "rpc"
      },
      "dappConnection": [
        "$WEB3",
        "localhost:8545"
      ],
      "gas": "auto",
      "contracts": {
        "TokenStorage": {
          "args": [
            100,
            "$SimpleStorage"
          ]
        },
        "MySimpleStorage": {
          "instanceOf": "SimpleStorage",
          "args": [300]
        },
        "SimpleStorage": {
          "args": [200]
        },
        "AnotherSimpleStorage": {
          "instanceOf": "SimpleStorage"
        }
      }
    };

    let embarkObj = {
      registerAPICall: () => {},
      fs: {
        existsSync: () => { return false; },
        dappPath: () => { return "ok"; }
      },
      logger: new Logger({}),
      events: events
    };

    let contractsManager = new ContractsManager(embarkObj, {
      plugins: plugins,
      contractDirectories: ['app/contracts']
    });

    const compiledContracts = {
      SimpleStorage: {"code":"608060405234801561001057600080fd5b506040516020806101358339810180604052602081101561003057600080fd5b505160005560f2806100436000396000f3fe60806040526004361060525763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632a1afcd98114605757806360fe47b114607b5780636d4ce63c1460a3575b600080fd5b348015606257600080fd5b50606960b5565b60408051918252519081900360200190f35b348015608657600080fd5b5060a160048036036020811015609b57600080fd5b503560bb565b005b34801560ae57600080fd5b50606960c0565b60005481565b600055565b6000549056fea165627a7a72305820f0f0591d202a197356437f28668ae8710c45231f114a6a93ed48996f2866269c0029","linkReferences":{},"runtimeBytecode":"60806040526004361060525763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632a1afcd98114605757806360fe47b114607b5780636d4ce63c1460a3575b600080fd5b348015606257600080fd5b50606960b5565b60408051918252519081900360200190f35b348015608657600080fd5b5060a160048036036020811015609b57600080fd5b503560bb565b005b34801560ae57600080fd5b50606960c0565b60005481565b600055565b6000549056fea165627a7a72305820f0f0591d202a197356437f28668ae8710c45231f114a6a93ed48996f2866269c0029","realRuntimeBytecode":"60806040526004361060525763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416632a1afcd98114605757806360fe47b114607b5780636d4ce63c1460a3575b600080fd5b348015606257600080fd5b50606960b5565b60408051918252519081900360200190f35b348015608657600080fd5b5060a160048036036020811015609b57600080fd5b503560bb565b005b34801560ae57600080fd5b50606960c0565b60005481565b600055565b6000549056fea165627a7a72305820","swarmHash":"f0f0591d202a197356437f28668ae8710c45231f114a6a93ed48996f2866269c","gasEstimates":{"creation":{"codeDepositCost":"48400","executionCost":"20172","totalCost":"68572"},"external":{"get()":"428","set(uint256)":"20197","storedData()":"384"}},"functionHashes":{"get()":"6d4ce63c","set(uint256)":"60fe47b1","storedData()":"2a1afcd9"},"abiDefinition":[{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialValue","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}],"userdoc":{"methods":{}},"filename":"/Users/emizzle/Code/__Github/embk-fw/embark/dapps/templates/demo/.embark/contracts/simple_storage.sol","originalFilename":"contracts/simple_storage.sol"},
      TokenStorage: {"code":"608060405234801561001057600080fd5b5060405160408061054a8339810180604052604081101561003057600080fd5b50805160209182015133600090815292839052604090922081905560025560038054600160a060020a03909216600160a060020a03199092169190911790556104cc8061007e6000396000f3fe6080604052600436106100825763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663095ea7b3811461008757806318160ddd146100d457806323b872dd146100fb57806370a082311461013e578063767800de14610171578063a9059cbb146101a2578063dd62ed3e146101db575b600080fd5b34801561009357600080fd5b506100c0600480360360408110156100aa57600080fd5b50600160a060020a038135169060200135610216565b604080519115158252519081900360200190f35b3480156100e057600080fd5b506100e961027c565b60408051918252519081900360200190f35b34801561010757600080fd5b506100c06004803603606081101561011e57600080fd5b50600160a060020a03813581169160208101359091169060400135610282565b34801561014a57600080fd5b506100e96004803603602081101561016157600080fd5b5035600160a060020a031661038e565b34801561017d57600080fd5b506101866103a9565b60408051600160a060020a039092168252519081900360200190f35b3480156101ae57600080fd5b506100c0600480360360408110156101c557600080fd5b50600160a060020a0381351690602001356103b8565b3480156101e757600080fd5b506100e9600480360360408110156101fe57600080fd5b50600160a060020a038135811691602001351661046e565b336000818152600160209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60025490565b600160a060020a0383166000908152602081905260408120548211156102a757600080fd5b600160a060020a03841660009081526001602090815260408083203384529091529020548211156102d757600080fd5b600160a060020a0383166000908152602081905260409020546102fa9083610499565b151561030557600080fd5b600160a060020a03808516600081815260016020908152604080832033845282528083208054889003905583835282825280832080548890039055938716808352918490208054870190558351868152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35060019392505050565b600160a060020a031660009081526020819052604090205490565b600354600160a060020a031681565b336000908152602081905260408120548211156103d457600080fd5b600160a060020a0383166000908152602081905260409020546103f79083610499565b151561040257600080fd5b3360008181526020818152604080832080548790039055600160a060020a03871680845292819020805487019055805186815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350600192915050565b600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b810110159056fea165627a7a7230582038173a32d78afba3c8a5d9841729d881859cd04c932365172db8ccbb71d7d8da0029","linkReferences":{},"runtimeBytecode":"6080604052600436106100825763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663095ea7b3811461008757806318160ddd146100d457806323b872dd146100fb57806370a082311461013e578063767800de14610171578063a9059cbb146101a2578063dd62ed3e146101db575b600080fd5b34801561009357600080fd5b506100c0600480360360408110156100aa57600080fd5b50600160a060020a038135169060200135610216565b604080519115158252519081900360200190f35b3480156100e057600080fd5b506100e961027c565b60408051918252519081900360200190f35b34801561010757600080fd5b506100c06004803603606081101561011e57600080fd5b50600160a060020a03813581169160208101359091169060400135610282565b34801561014a57600080fd5b506100e96004803603602081101561016157600080fd5b5035600160a060020a031661038e565b34801561017d57600080fd5b506101866103a9565b60408051600160a060020a039092168252519081900360200190f35b3480156101ae57600080fd5b506100c0600480360360408110156101c557600080fd5b50600160a060020a0381351690602001356103b8565b3480156101e757600080fd5b506100e9600480360360408110156101fe57600080fd5b50600160a060020a038135811691602001351661046e565b336000818152600160209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60025490565b600160a060020a0383166000908152602081905260408120548211156102a757600080fd5b600160a060020a03841660009081526001602090815260408083203384529091529020548211156102d757600080fd5b600160a060020a0383166000908152602081905260409020546102fa9083610499565b151561030557600080fd5b600160a060020a03808516600081815260016020908152604080832033845282528083208054889003905583835282825280832080548890039055938716808352918490208054870190558351868152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35060019392505050565b600160a060020a031660009081526020819052604090205490565b600354600160a060020a031681565b336000908152602081905260408120548211156103d457600080fd5b600160a060020a0383166000908152602081905260409020546103f79083610499565b151561040257600080fd5b3360008181526020818152604080832080548790039055600160a060020a03871680845292819020805487019055805186815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350600192915050565b600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b810110159056fea165627a7a7230582038173a32d78afba3c8a5d9841729d881859cd04c932365172db8ccbb71d7d8da0029","realRuntimeBytecode":"6080604052600436106100825763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663095ea7b3811461008757806318160ddd146100d457806323b872dd146100fb57806370a082311461013e578063767800de14610171578063a9059cbb146101a2578063dd62ed3e146101db575b600080fd5b34801561009357600080fd5b506100c0600480360360408110156100aa57600080fd5b50600160a060020a038135169060200135610216565b604080519115158252519081900360200190f35b3480156100e057600080fd5b506100e961027c565b60408051918252519081900360200190f35b34801561010757600080fd5b506100c06004803603606081101561011e57600080fd5b50600160a060020a03813581169160208101359091169060400135610282565b34801561014a57600080fd5b506100e96004803603602081101561016157600080fd5b5035600160a060020a031661038e565b34801561017d57600080fd5b506101866103a9565b60408051600160a060020a039092168252519081900360200190f35b3480156101ae57600080fd5b506100c0600480360360408110156101c557600080fd5b50600160a060020a0381351690602001356103b8565b3480156101e757600080fd5b506100e9600480360360408110156101fe57600080fd5b50600160a060020a038135811691602001351661046e565b336000818152600160209081526040808320600160a060020a038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60025490565b600160a060020a0383166000908152602081905260408120548211156102a757600080fd5b600160a060020a03841660009081526001602090815260408083203384529091529020548211156102d757600080fd5b600160a060020a0383166000908152602081905260409020546102fa9083610499565b151561030557600080fd5b600160a060020a03808516600081815260016020908152604080832033845282528083208054889003905583835282825280832080548890039055938716808352918490208054870190558351868152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35060019392505050565b600160a060020a031660009081526020819052604090205490565b600354600160a060020a031681565b336000908152602081905260408120548211156103d457600080fd5b600160a060020a0383166000908152602081905260409020546103f79083610499565b151561040257600080fd5b3360008181526020818152604080832080548790039055600160a060020a03871680845292819020805487019055805186815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350600192915050565b600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b810110159056fea165627a7a72305820","swarmHash":"38173a32d78afba3c8a5d9841729d881859cd04c932365172db8ccbb71d7d8da","gasEstimates":{"creation":{"codeDepositCost":"245600","executionCost":"60850","totalCost":"306450"},"external":{"addr()":"625","allowance(address,address)":"882","approve(address,uint256)":"22377","balanceOf(address)":"711","totalSupply()":"406","transfer(address,uint256)":"43611","transferFrom(address,address,uint256)":"64444"},"internal":{"safeToAdd(uint256,uint256)":"24"}},"functionHashes":{"addr()":"767800de","allowance(address,address)":"dd62ed3e","approve(address,uint256)":"095ea7b3","balanceOf(address)":"70a08231","totalSupply()":"18160ddd","transfer(address,uint256)":"a9059cbb","transferFrom(address,address,uint256)":"23b872dd"},"abiDefinition":[{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"ok","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"ok","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"value","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"addr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"ok","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"_allowance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initial_balance","type":"uint256"},{"name":"_addr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}],"userdoc":{"methods":{}},"filename":"/Users/emizzle/Code/__Github/embk-fw/embark/dapps/templates/demo/.embark/contracts/token_storage.sol","originalFilename":"contracts/token_storage.sol"}
    };

    describe('#build', function() {
      it('generate contracts', function(done) {
        contractsManager.buildContracts(contractsConfig, compiledContracts, function(err, _result) {
          if (err) {
            throw err;
          }

          let contracts = contractsManager.listContracts();
          assert.equal(contracts.length, 4);

          assert.equal(contracts[0].className, "MySimpleStorage");
          assert.equal(contracts[1].className, "AnotherSimpleStorage");
          assert.equal(contracts[2].className, "SimpleStorage");
          assert.equal(contracts[3].className, "TokenStorage");

          // TokenStorage
          assert.equal(contracts[3].deploy, true);
          assert.deepEqual(contracts[3].args, [100, '$SimpleStorage']);
          //assert.deepEqual(contracts[3].gas, 725000);
          assert.deepEqual(contracts[3].gas, 'auto');
          assert.equal(contracts[3].type, 'file');
          //assert.equal(contracts[3].abiDefinition, '');
          //assert.equal(contracts[3].code, '');
          //assert.equal(contracts[3].runtimeBytecode, '');

          let parentContract = contracts[2];

          //MySimpleStorage
          assert.equal(contracts[0].deploy, true);
          assert.deepEqual(contracts[0].args, [300]);
          //assert.deepEqual(contracts[0].gas, 725000);
          assert.deepEqual(contracts[0].gas, 'auto');
          assert.equal(contracts[0].type, 'instance');
          assert.equal(contracts[0].abiDefinition, parentContract.abiDefinition);
          assert.equal(contracts[0].code, parentContract.code);
          assert.equal(contracts[0].runtimeBytecode, parentContract.runtimeBytecode);

          // SimpleStorage
          assert.equal(contracts[2].deploy, true);
          assert.deepEqual(contracts[2].args, [200]);
          //assert.deepEqual(contracts[2].gas, 725000);
          assert.deepEqual(contracts[2].gas, 'auto');
          assert.equal(contracts[2].type, 'file');
          //assert.equal(contracts[2].abiDefinition, '');
          //assert.equal(contracts[2].code, '');
          //assert.equal(contracts[2].runtimeBytecode, '');

          // AnotherSimpleStorage
          assert.equal(contracts[1].deploy, true);
          assert.deepEqual(contracts[1].args, [200]);
          //assert.deepEqual(contracts[1].gas, 725000);
          assert.deepEqual(contracts[1].gas, 'auto');
          assert.equal(contracts[1].type, 'instance');
          assert.equal(contracts[1].abiDefinition, parentContract.abiDefinition);
          assert.equal(contracts[1].code, parentContract.code);
          assert.equal(contracts[1].runtimeBytecode, parentContract.runtimeBytecode);
          done();
        });
      });
    });
  });

});