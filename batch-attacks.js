/** @param {NS} ns */
export async function main(ns) {
const reserveRam = 45

    //List all servers
    function listServers(ns) {
      let servers = new Set(["home"])
      servers.forEach(h => { ns.scan(h).forEach(n => servers.add(n)); });
      return Array.from(servers)
    }

    //Find the best server to hack
    function getBestServer(ns) {
      var prevServ = "n00dles"
      for (const serv of servers) {
        const hackingRequired = ns.getServerRequiredHackingLevel(serv)
        const weightedMoney = ns.getServerMaxMoney(serv) / ns.getServerMinSecurityLevel(serv)
        const prevWM = ns.getServerMaxMoney(prevServ) / ns.getServerMinSecurityLevel(prevServ)
        if (hackingRequired < (ns.getHackingLevel() * 0.5) && weightedMoney > prevWM && ns.hasRootAccess(serv)) {
          prevServ = serv
        }
      }
      return prevServ
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

      var target = getBestServer(ns)
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
      var level = 1
      if (ns.getHackingLevel() > level + 40) { //Update target every x hacking levels
        var level = ns.getHackingLevel()
        target = getBestServer(ns)
      }
  
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
      var weaken1Threads = Math.ceil((hackThreads * 0.002 + growThreads * 0.004) / ns.weakenAnalyze(1) * 1.4)
      var batchRam = (growThreads + weaken1Threads) * 1.75 + hackThreads * 1.7
  
      // calculate total available RAM
      function availableRam() {
        var availableRam = 0
        for (const serv of servers) {
          try {
            let servRam = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)
            availableRam = availableRam + servRam
          } catch (error) {
            ns.print(error + "server not available ???")
          }
        }
        return availableRam
      }

      //Run one batch
      if (availableRam() > batchRam) { // check if enough RAM for 1 batch
        ns.print("running 1 batch ! on " + target + "sec=" + Math.floor(ns.getServerSecurityLevel(target)) + "$:" + Math.floor(ns.getServerMoneyAvailable(target)) / 1000)

       while ((growThreads + weaken1Threads + hackThreads) > 0) { //run 1 batch until done
  
          for (const serv of servers) { // run through all servers to allocate the batch              bloqué dans cette boucle ?
            try {
              //weaken
              let availableThreads = getAvailableThreads(ns, serv, 1.75)
            if (availableThreads > weaken1Threads && weaken1Threads > 0) {
                ns.exec("single-weaken.js", serv, weaken1Threads, target, weaken1Delay)
                weaken1Threads = 0
            }
              //hack
              availableThreads = getAvailableThreads(ns, serv, 1.70)
              if (availableThreads > hackThreads && hackThreads > 0) {
                ns.exec("single-hack.js", serv, hackThreads, target, hackDelay)
                hackThreads = 0
            }
              //grow
              availableThreads = getAvailableThreads(ns, serv, 1.75)
              if (availableThreads > growThreads && growThreads > 0) {
                ns.exec("single-grow.js", serv, growThreads, target, growDelay)
                growThreads = 0
            }          
            } catch (error) {
              ns.print(error)
            }
          }
          await ns.sleep(0)
        }       
      } else {
        ns.print("Can't batch, need more ram:" + batchRam )
      }
      ns.print("money" + Math.floor(ns.getServerMoneyAvailable(target)) + " sec" + ns.getServerSecurityLevel(target))

      await ns.sleep(delay*4 + 5) // change to 1000 if stepping over other batches
    }
  }
  

/*   
Date.now();


const startTime = Date.now();
    const endTime = Date.now() + ns.getWeakenTime();
    timeElapsed = Date.now() - startTime;

check for new target every x time or level or whatever...

- some sort of communal logging system that all workers can write to. A monitor script or a txt log file are both valid options for this.

Let’s consider this step passed when you can write a script that consistently deploys a HWGW batch such that each job finishes in the correct order
and within 20ms of each other and successfully returns the server to a prepped state. Establishing how you know you’ve passed is a crucial part of this step, and should not be overlooked.



    ns.write("console.txt", "Finished hack at " + Date.now()+ "\n")


*** Ports ***
Create port:  port = ns.getPortHandle(int);

port.peek();
port.read();
port.write(value);
port.tryWrite(1, "DATA");

port.clear();
port.empty();
port.full();
port.nextWrite();

-> use this through port JSON.stringify(object);
JSON.parse(string);
 */