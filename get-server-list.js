/** @param {NS} ns */
export async function main(ns) {

    // Create a set; sets can iterate and contain no duplicates
    let servers = new Set(["home"])
    
    // iterate through set
    servers.forEach(h => { ns.scan(h).forEach(n => servers.add(n)); });
    
    // return an array from the set
    servers = Array.from(servers)
    
    // Print list of servers with max money and hacking requirements
    // for all servers that are underneath 1/3 of hacking level
      for (let i = 0; i < servers.length; i++) {
        const serv = servers[i]
        const hackingRequired = ns.getServerRequiredHackingLevel(serv)
        const money = ns.getServerMaxMoney(serv)
        const sec = ns.getServerMinSecurityLevel(serv)
        if (hackingRequired < (ns.getHackingLevel() / 2) && money > 1) {
          ns.tprint(serv, " | sec " + sec, " | money " + money / 1000000 + " M");
        };
      }
    }
    
    