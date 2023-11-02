/** @param {NS} ns */
export async function main(ns) {
    const currentServers = ns.getPurchasedServers();
    for (let i = 0; i < currentServers.length; i++) {
    let serv = currentServers[i];
    ns.killall(serv);
	  ns.deleteServer(serv);
  }
}