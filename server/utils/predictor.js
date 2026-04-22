exports.analyzeStudent = (data) => {
  let goodPoints = [];
  let badPoints = [];

  // Logic: 
  // High Risk → attendance < 50 OR marks < 40
  // Medium Risk → moderate values (e.g. attendance < 75 OR marks < 60)
  // Low Risk → good performance

  const attendance = data.attendance || 0;
  const marks = data.examScore || 0;

  let risk = "Low";

  if (attendance < 50 || marks < 40) {
    risk = "High";
    if (attendance < 50) badPoints.push("Critically Low Attendance (<50%)");
    if (marks < 40) badPoints.push("Critical Academic Performance (<40 marks)");
  } else if (attendance < 75 || marks < 60) {
    risk = "Medium";
    if (attendance < 75) badPoints.push("Low Attendance");
    if (marks < 60) badPoints.push("Average Academic Performance");
  } else {
    risk = "Low";
    goodPoints.push("Good Attendance");
    goodPoints.push("Strong Academic Performance");
  }

  return {
    risk: risk.toUpperCase(), // Keeping uppercase for consistency with current code usage
    goodPoints,
    badPoints,
    suggestions: generateSuggestions(badPoints)
  };
};

function generateSuggestions(badPoints) {
  let suggestions = [];

  badPoints.forEach(point => {
    if (point.includes("Attendance"))
      suggestions.push("Attend classes regularly to cross the 75% threshold");

    if (point.includes("Performance") || point.includes("Academic"))
      suggestions.push("Schedule a one-on-one session for academic support");
  });

  if (suggestions.length === 0) {
    suggestions.push("Keep up the great work!");
  }

  return suggestions;
}