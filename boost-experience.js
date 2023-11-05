/** @param {NS} ns */
export async function main(ns) {
    var target = "joesguns" //It is said it's the best target for XP farm
    var reserveRam = 120

    //List all servers
    let servers = new Set(["home"])
    servers.forEach(h => { ns.scan(h).forEach(n => servers.add(n)); });
    servers = Array.from(servers)
  
    // Number of available threads
    function getThreadCount(ns, serv, scriptRam) {
      if (serv === "home") {
        var ram = (ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) - reserveRam // reserve some RAM on home
      } else {
        var ram = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)
      }
      return Math.floor(ram / scriptRam)
    }

    // Copy scripts to servers
    for (const serv of servers) {
      ns.scp(["single-grow.js", "single-weaken.js", "single-hack.js", "single-share.js"], serv);
    }
  

    var sharing = ns.args[0]
    if (sharing == "sharing") {
    // Execute share
    while (true) {
      for (const serv of servers) {
          try {
            //share
            var threads = getThreadCount(ns, serv, 4)
              ns.exec("single-share.js", serv, threads)
          } catch (error) {
            ns.print(error)
          }
      }
      await ns.sleep(0)
    }
    }


    // Execute weakens then grow
    while (true) {
  
      for (const serv of servers) {
          try {
            //weaken
            var threads = getThreadCount(ns, serv, 1.75)
            if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
              ns.exec("single-weaken.js", serv, 10, target, 0)
            }
            ns.exec("single-grow.js", serv, threads, target, 0)
          } catch (error) {
            ns.print(error)
          }
      }
      await ns.sleep(0) // change to 1000 when ready to multi batch
    }
  }
  