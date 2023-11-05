/** @param {NS} ns */
export async function main(ns) {
const cities = ["Aevum", "Chongqing", "New Tokyo", "Ishima", "Volhaven"]
const jobs = ["Operations", "Engineer", "Business", "Management", "Research & Development", "Intern"]

var divisions = [] 

// Set jobs
function setJobs() {
    for (const division of divisions) {
        if (division = "Tobacco") {
            let ratios = [0.26, 0.26, 1, 0.38, 0, 0.1]
            autoJobs(division, jobs, ratios)
        }
    }

/* For product development:
    Operations: 29%
    Engineering: 29%
    Business: Exactly 1
    Management: 42% */

}

function autoJobs(division, jobs, amount) {
    for (const city of cities) {
        for (const job of jobs) {
            let ratio = ratios(job)
            ns.corporation.setAutoJobAssignment(division, city, job, amount)
        }
    }
}

// Expand division to all cities
    function expand(division) {
        for (const city of cities) {
            ns.corporation.expandCity(division, city)
            ns.corporation.purchaseWarehouse(division, city)
        }
    }


// Set a loop agri <-> chemicals
function agriLoop() {
    let sourceDiv = "Agriculture"
    let targetDiv = "Chemicals"
    
    for (const city of cities) {
        ns.corporation.exportMaterial(
            sourceDiv,
            city,
            targetDiv,
            city,
            "Plants",
            "(IPROD+IINV/10)*(-1)"
        )
    }
    
    sourceDiv = "Chemicals"
    targetDiv = "Agriculture"
    for (const city of sourceCity) {
        ns.corporation.exportMaterial(
            sourceDiv,
            city,
            targetDiv,
            city,
            "Chemicals",
            "(IPROD+IINV/10)*(-1)"
        )
    }
}

    // Main loop
    while (true) {
        for (const division of divisions) {
            expand(division)
        }

agriLoop()


    await ns.sleep(10000)
    }



}

