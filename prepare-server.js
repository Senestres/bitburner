/** @param {NS} ns */
/** @param {import(".").NS} ns */
export async function main(ns) {
    const target = ns.args[0]
    const reserveRam = 45 // reserve some RAM on home
    var maxMoney = ns.getServerMaxMoney(target)

    // get list of all servers
    function listServers(ns) {
      let servers = new Set(["home"])
      servers.forEach(h => { ns.scan(h).forEach(n => servers.add(n)); });
      return Array.from(servers)
    }
  
    // get thread count
    function getAvailableThreads(ns, serv, scriptRam) {
      if (serv === "home") {
        var ram = (ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) - reserveRam
      } else {
        var ram = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)
      }
      return Math.floor(ram / scriptRam)
    }
  
    while (maxMoney > ns.getServerMoneyAvailable(target) || ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
      var servers = listServers(ns)
      var money = ns.getServerMoneyAvailable(target)
      if (money == 0) {money = 1}
   
      // number of threads for one batch
      var weakenThreads = Math.ceil((ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) / ns.weakenAnalyze(1))
      var growThreads = Math.ceil(ns.growthAnalyze(target, maxMoney / money))
      var weakenThreads2 = Math.ceil(growThreads * 0.004 / ns.weakenAnalyze(1))
  
      // times and delays
      var weakenTime = ns.getWeakenTime(target)
      var growTime = ns.getGrowTime(target)
  
      const delay = 100
      let weakenDelay = 0
      let growDelay = (weakenTime - growTime) - delay
      let weakenDelay2 = delay
  
      //batch loop
      for (const serv of servers) {
        let wgThreads = getAvailableThreads(ns, serv, 1.75)
        if (ns.hasRootAccess(serv)) {
          try {
            //weaken
            let threads = Math.min(weakenThreads, wgThreads)
            if (threads > 0) {
              ns.exec("single-weaken.js", serv, threads, target, weakenDelay)
              weakenThreads -= threads
            }
            //grow
            threads = Math.min(growThreads, wgThreads)
            if (threads > 0) {
              ns.exec("single-grow.js", serv, threads, target, growDelay)
              growThreads -= threads
            }
            //weaken
            threads = Math.min(weakenThreads2, wgThreads)
            if (threads > 0) {
              ns.exec("single-weaken.js", serv, threads, target, weakenDelay2)
              weakenThreads2 -= threads
            }
          } catch (error) {
            ns.print(error)
          }
        }
      }
      await ns.sleep(10)
    }
  }
  