/** @param {NS} ns */
export async function main(ns) {
  var maxHacknets = 25
    while (ns.hacknet.numNodes() < maxHacknets) {
      var money = ns.getServerMoneyAvailable("home")
      var moneyTresh = money * 0.004
      if (ns.hacknet.getPurchaseNodeCost() < moneyTresh) {
        ns.hacknet.purchaseNode();
        ns.print("purchasing new hacknet node")
      }
      for (let i = 0; i < ns.hacknet.numNodes(); i++) {
        if (ns.hacknet.getLevelUpgradeCost(i, 1) < moneyTresh && ns.hacknet.getNodeStats(i).level < 200) {
          ns.hacknet.upgradeLevel(i, 1);
          ns.print("purchasing hacknet upgrade")
        }
        if (ns.hacknet.getRamUpgradeCost(i, 1) < moneyTresh && ns.hacknet.getNodeStats(i).ram < 64) {
          ns.hacknet.upgradeRam(i, 1);
          ns.print("purchasing hacknet ram")
        }
        if (ns.hacknet.getCoreUpgradeCost(i, 1) < moneyTresh && ns.hacknet.getNodeStats(i).cores < 12) {
          ns.hacknet.upgradeCore(i, 1);
          ns.print("purchasing hacknet core")
        }
      }
      await ns.sleep(1000);
    }
    ns.tprint(`Bought ${maxHacknets} hacknets.`)
  }