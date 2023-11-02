/** @param {NS} ns */
export async function main(ns) {
    const canSolve = ["Array Jumping Game",
      "Total Ways to Sum",
      "Find Largest Prime Factor",
      "Subarray with Maximum Sum"]
  
    // Create a set; sets can iterate and contain no duplicates *** replace with external function=?
    let servers = new Set(["home"])
    // iterate through set
    servers.forEach(h => { ns.scan(h).forEach(n => servers.add(n)); });
    // return an array from the set
    servers = Array.from(servers)
  
    while (true) {
      for (const server of servers) {
        try {
          // list all contracts
          let contracts = ns.ls(server, ".cct")
          if (contracts.length > 0) {
            for (const contract of contracts) {
              var contractType = ns.codingcontract.getContractType(contract, server)
              if (canSolve.includes(contractType)) {
                ns.tprint(contractType + " contracts on " + server)     // print hostname + contract name
              }
            }
          }
        } catch(error) {
          ns.print(error)
        }
      }
      await ns.sleep(600000)
    }
  }