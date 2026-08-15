const stringSimilarity = require("string-similarity");

const detectDuplicate = async (prisma, newCamperData) => {
  // Fetch all campers (or limit to same year of birth to optimize)
  const existingCampers = await prisma.camper.findMany({
    select: { id: true, first_name: true, last_name: true, dob: true }
  });

  const newFullName = `${newCamperData.first_name} ${newCamperData.last_name}`.toLowerCase();
  
  for (const camper of existingCampers) {
    const existingFullName = `${camper.first_name} ${camper.last_name}`.toLowerCase();
    
    const nameMatch = stringSimilarity.compareTwoStrings(newFullName, existingFullName);
    
    // Check if dates match (ignoring time)
    const isSameDate = new Date(newCamperData.dob).getTime() === new Date(camper.dob).getTime();

    // If name is very similar (>= 0.8) and DOB matches, flag as duplicate
    if (nameMatch >= 0.8 && isSameDate) {
      return {
        isDuplicate: true,
        matchedCamperId: camper.id,
        confidence: nameMatch
      };
    }
  }

  return { isDuplicate: false };
};

module.exports = { detectDuplicate };
