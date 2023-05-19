class Grade {
  static A_PLUS = new Grade("A+", "Excellent");
  static A = new Grade("A", "Very Good");
  static B = new Grade("B", "Good");
  static C = new Grade("C", "Adequate");
  static D = new Grade("D", "Inadequate");

  constructor(grade, description) {
    this.grade = grade;
    this.description = description;
  }
}

const scoreToLetterGrade = (score) => {
  let result;

  if (score == 100) {
    result = Grade.A_PLUS;
  } else if (score >= 90) {
    result = Grade.A;
  } else if (score >= 75) {
    result = Grade.B;
  } else if (score >= 50) {
    result = Grade.C;
  } else {
    result = Grade.D;
  }

  return result;
};

function calculateRating(score) {
  const grade = scoreToLetterGrade(score);
  return { rating: grade.grade, ratingDescription: grade.description };
}

module.exports = { scoreToLetterGrade, calculateRating };
