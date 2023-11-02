/** @param {NS} ns */
export async function main(ns) {
    // check if there are already servers to base RAM on
    // if not, set base RAM to 2
    if (ns.getPurchasedServers().length === 0) {
      var baseRAM = 4
    } else {
      var firstServer = ns.getPurchasedServers()[0]
      var baseRAM = ns.getServerMaxRam(firstServer) * 2
    }
  
    // run a loop starting at base RAM; tries to upgrade all servers, then double RAM
    for (baseRAM; baseRAM < (2 ** 20); baseRAM *= 2) {
      // How much RAM each purchased server will have.
      var ram = baseRAM
  
      //if enough money available to buy x servers, delete servers
      while (ns.getServerMoneyAvailable("home") < ns.getPurchasedServerCost(ram) * 13) {
        await ns.sleep(60000);
      }
      var currentServers = ns.getPurchasedServers();
      for (let i = 0; i < currentServers.length; i++) {
        let serv = currentServers[i];
        ns.killall(serv);
        ns.deleteServer(serv);
      }
      // Continuously try to purchase servers until we've reached the maximum
      for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
        // Check if we have enough money to purchase a server
        while (ns.getServerMoneyAvailable("home") < ns.getPurchasedServerCost(ram)) {
          await ns.sleep(10000);
        }
        let hostname = ns.purchaseServer("pserv-" + i, ram);
        ns.scp(["single-grow.js", "single-weaken.js", "single-hack.js"], hostname);
  //Maybe should reload batch script -> update server total ram etc.
        await ns.sleep(1000);
      }
      ns.tprint("buying new servers: " + baseRAM)
    }
  }
  