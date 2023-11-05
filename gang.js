/** @param {NS} ns */
export async function main(ns) {
    // members
    let equipment = ns.gang.getEquipmentNames()
    let rootkits = equipment.filter(tool => ns.gang.getEquipmentType(tool) == "Rootkit")
    let augmentations = equipment.filter(tool => ns.gang.getEquipmentType(tool) == "Augmentation")
    augmentations = augmentations.filter(tool => ns.gang.getEquipmentStats(tool).hack > 0)
  
    //for (const member of members) {
    //let memberInfo = ns.getMemberInformation(member)
    //}
  
    while (true) {
      let members = ns.gang.getMemberNames()
      
      // recruit new members
      if (ns.gang.canRecruitMember()) {
        let lastMember = members.length
        let newMember = lastMember + 1
        ns.gang.recruitMember(newMember)
        ns.gang.setMemberTask(newMember, "Train Hacking");
      }
  
      for (const member of members) {
        // upgrade augmentations ??? should be the priority
        for (let i = 0; i < augmentations.length; i++) {
          let augmentation = augmentations[i]
  
          if (ns.gang.getEquipmentCost(augmentation) < (ns.getServerMoneyAvailable("home") * 0.5)) {
            ns.gang.purchaseEquipment(member, augmentation)
          }
        }
  
        // ascend
          if (ns.gang.getAscensionResult(member)?.hack > 1.5) { // somestimes comes as undefined ??
            ns.gang.setMemberTask(member, "Train Hacking");
            ns.gang.ascendMember(member)
          }

  
        // upgrade equipment
        for (let i = 0; i < rootkits.length; i++) {
          let rootkit = rootkits[i]
  
          if (ns.gang.getEquipmentCost(rootkit) < ns.getServerMoneyAvailable("home") * 0.001) {
            ns.gang.purchaseEquipment(member, rootkit)
          }
        }
      }
      await ns.sleep(60000)
    }
  }
  
    // Gang.setMemberTask()
  
    // penalty is wanted/ (respect + wanted)