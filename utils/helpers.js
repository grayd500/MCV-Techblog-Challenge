// utils/helpers.js:
module.exports = {
  format_date: (date) => {
    // Check if the date is valid
    if (date instanceof Date && !isNaN(date)) {
      return date.toLocaleDateString();
    } else {
      // Handle the case where the date is not valid
      console.error('Invalid date provided to format_date helper:', date);
      return 'Invalid date'; // Or any other placeholder text you prefer
    }
  },
  // ...other helpers
};


   