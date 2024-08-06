const CURR_YEAR = new Date().getFullYear();
const CURR_MONTH = new Date().getMonth() + 1;

const AWARD_MONTH = 2; // Assumes GRAMMIFY Awards are held in February
export const AWARD_YEAR = (CURR_MONTH > AWARD_MONTH) ? CURR_YEAR + 1 : CURR_YEAR;

export const ELIGIBILITY = {
  start_month: 9, // Elibilility period begins Sept 16
  start_day: 16,
  end_month: 8, // Elibilility period ends Aug 30
  end_day: 30
};

export const NUM_NOMINATIONS = 5; // Needs 5 nominees per category
