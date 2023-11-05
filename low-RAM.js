/** @param {NS} ns */
export async function main(ns) {
    const reserveRam = 45
    
        //List all servers
        function listServers(ns) {
          let servers = new Set(["home"])
          servers.forEach(h => { ns.scan(h).forEach(n => servers.add(n)); });
          return Array.from(servers)
        }
    
        // Number of threads
        function getAvailableThreads(ns, serv, scriptRam) {
          if (serv === "home") {
            var ram = (ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) - reserveRam // reserve RAM on home
          } else {
            var ram = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)
          }
          return Math.floor(ram / scriptRam)
        }
      
        var servers = listServers(ns)
        // copy scripts to server
        for (const serv of servers) {
          ns.scp(["single-grow.js", "single-weaken.js", "single-hack.js"], serv);
        }
    
          var target = "foodnstuff" // getBestServer(ns)
        const securityThresh = ns.getServerMinSecurityLevel(target);
      
        if (ns.getServerMaxMoney(target) > ns.getServerMoneyAvailable(target) || ns.getServerSecurityLevel(target) > securityThresh) {
          var pid = ns.run("prepare-server.js", 1, target)
          while (ns.getRunningScript(pid) !== null) {
            await ns.sleep(100)                                        // Await the end of the running script ???
          }
          ns.tprint("Finished growing" + target + " sec= " + ns.getServerSecurityLevel(target) + " money= " + ns.getServerMoneyAvailable(target))
        }
    
      // Launch batches
        while (true) { 
      
          servers = listServers(ns)
          var moneyThresh = ns.getServerMaxMoney(target) * 0.5;
      
          // Times and delays
          var weakenTime = ns.getWeakenTime(target)
          var hackTime = ns.getHackTime(target)
          var growTime = ns.getGrowTime(target)
      
          const delay = 10
          let hackDelay = (weakenTime - hackTime) - delay * 2
          let weaken1Delay = 0
          let growDelay = (weakenTime - growTime) - delay
      
          // Number of threads for one batch
          var hackThreads = Math.floor(ns.hackAnalyzeThreads(target, moneyThresh))
          var growThreads = Math.ceil(ns.growthAnalyze(target, 3))
          var weaken1Threads = Math.ceil((hackThreads * 0.002 + growThreads * 0.004) / ns.weakenAnalyze(1) * 1.5)
      
          //Run one batch
            ns.print("running 1 batch ! on " + target + "sec=" + Math.floor(ns.getServerSecurityLevel(target)) + "$:" + Math.floor(ns.getServerMoneyAvailable(target)) / 1000)
    
           while ((growThreads + weaken1Threads + hackThreads) > 0) { //run 1 batch until done
      
              for (const serv of servers) { // run through all servers to allocate the batch              bloqué dans cette boucle ?
                try {
                //hack
                let availableThreads = getAvailableThreads(ns, serv, 1.70)
                  availableThreads = Math.min(availableThreads, hackThreads)
                  if (availableThreads > 0) {
                    ns.exec("single-hack.js", serv, availableThreads, target, hackDelay)
                    hackThreads -= availableThreads
                }
                  //weaken
                  availableThreads = getAvailableThreads(ns, serv, 1.75)
                  availableThreads = Math.min(availableThreads, weaken1Threads)
                if (availableThreads > 0) {
                    ns.exec("single-weaken.js", serv, availableThreads, target, weaken1Delay)
                    weaken1Threads -= availableThreads
                }
                  //grow
                  availableThreads = getAvailableThreads(ns, serv, 1.75)
                  availableThreads = Math.min(availableThreads, growThreads)
                  if (availableThreads > 0) {
                    ns.exec("single-grow.js", serv, availableThreads, target, growDelay)
                    growThreads -= availableThreads
                }          
                } catch (error) {
                  ns.print(error)
                }
              }
              await ns.sleep(0)
            }       
          ns.print("money" + Math.floor(ns.getServerMoneyAvailable(target)) + " sec" + ns.getServerSecurityLevel(target))
    
          await ns.sleep(delay*4 + 5) // change to 1000 if stepping over other batches
        }
      }