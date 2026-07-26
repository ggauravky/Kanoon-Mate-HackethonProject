export const FIRST_NAMES = [
  'Rahul', 'Priya', 'Vikramaditya', 'Ananya', 'Rajesh', 'Suresh', 'Amit', 'Neha',
  'Rohan', 'Sneha', 'Deepak', 'Kavita', 'Arjun', 'Pooja', 'Siddharth', 'Meera',
  'Aditya', 'Ritu', 'Manish', 'Shweta', 'Nitin', 'Divya', 'Sanjay', 'Sunita',
  'Aakash', 'Kriti', 'Vijay', 'Tanvi', 'Abhishek', 'Swati', 'Alok', 'Rashmi',
  'Venkatesh', 'Lakshmi', 'Ramesh', 'Aparna', 'Subhash', 'Nandini', 'Prashant',
  'Archana', 'Girish', 'Bhavna', 'Pradeep', 'Radhika', 'Kartik', 'Simran',
  'Tushar', 'Sonali', 'Yash', 'Anushka', 'Harish', 'Preeti', 'Sameer', 'Monika',
]

export const LAST_NAMES = [
  'Sharma', 'Malhotra', 'Singh', 'Roy', 'Kulkarni', 'Reddy', 'Gupta', 'Verma',
  'Patel', 'Joshi', 'Deshmukh', 'Mehta', 'Nair', 'Iyer', 'Chatterjee', 'Banerjee',
  'Das', 'Chowdhury', 'Mishra', 'Pandey', 'Shukla', 'Trivedi', 'Bhat', 'Rao',
  'Gowda', 'Menon', 'Pillai', 'Saxena', 'Agrawal', 'Singhania', 'Srivastava',
  'Sinha', 'Thakur', 'Chauhan', 'Rathore', 'Kapoor', 'Khanna', 'Chawla', 'Gill',
  'Grewal', 'Sen', 'Dutta', 'Patnaik', 'Mohanty', 'Bora', 'Goswami', 'Kaul',
]

/**
 * Returns a random full advocate name prefixed with "Adv."
 */
export const getRandomAdvocateName = (index) => {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length]
  const lastName = LAST_NAMES[(index * 3 + 7) % LAST_NAMES.length]
  return `Adv. ${firstName} ${lastName}`
}
